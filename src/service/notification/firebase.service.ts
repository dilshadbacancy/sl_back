import * as admin from 'firebase-admin';
import { Op } from 'sequelize';
import { FCM } from '../../models/user/fcm.model';
import { AppErrors } from '../../errors/app.errors';

// Initialize Firebase Admin SDK
let firebaseInitialized = false;

function initializeFirebase() {
    if (firebaseInitialized) return;

    try {
        // Check if Firebase credentials are provided via environment variables
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

        if (serviceAccount) {
            // If service account is provided as JSON string
            const serviceAccountJson = JSON.parse(serviceAccount);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccountJson)
            });
        } else if (process.env.FIREBASE_PROJECT_ID) {
            // Use individual environment variables
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                })
            });
        } else {
            console.warn('⚠️ Firebase credentials not found. Push notifications will be disabled.');
            return;
        }

        firebaseInitialized = true;
        console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin SDK:', error);
        throw new AppErrors('Failed to initialize Firebase Admin SDK');
    }
}

// Initialize on module load
initializeFirebase();

interface NotificationPayload {
    title: string;
    message: string;
    data: Record<string, any>;
}

export class FirebaseNotificationService {
    /**
     * Get FCM tokens for a user
     */
    static async getUserFCMTokens(userId: string): Promise<string[]> {
        if (!userId) return [];

        try {
            const fcmRecords = await FCM.findAll({
                where: { user_id: userId },
                attributes: ['id', 'token']
            });

            const tokens: string[] = [];
            for (const record of fcmRecords) {
                const tokenData = record.token as any;
                if (tokenData && typeof tokenData === 'object' && tokenData.token) {
                    tokens.push(String(tokenData.token));
                } else if (typeof tokenData === 'string') {
                    // Handle case where token is stored as string
                    tokens.push(tokenData);
                }
            }

            return tokens;
        } catch (error) {
            console.error('Error fetching FCM tokens:', error);
            return [];
        }
    }

    /**
     * Send notification to a single user
     */
    static async sendNotificationToUser(
        userId: string,
        payload: NotificationPayload
    ): Promise<boolean> {
        console.log("payload", payload);


        if (!firebaseInitialized) {
            console.warn('Firebase not initialized. Skipping notification.');
            return false;
        }

        try {
            const tokens = await this.getUserFCMTokens(userId);

            if (tokens.length === 0) {
                console.log(`No FCM tokens found for user: ${userId}`);
                return false;
            }

            const message: admin.messaging.MulticastMessage = {
                notification: {
                    title: payload.title,
                    body: payload.message,
                },
                data: {
                    ...Object.entries(payload.data).reduce((acc, [key, value]) => {
                        acc[key] = String(value);
                        return acc;
                    }, {} as Record<string, string>),
                },
                tokens: tokens,
                android: {
                    priority: 'high' as const,
                },
                apns: {
                    headers: {
                        'apns-priority': '10',
                    },
                },
            };

            const response = await admin.messaging().sendEachForMulticast(message);

            console.log(`✅ Notification sent to ${response.successCount} device(s) for user ${userId}`);

            // Remove invalid tokens
            if (response.failureCount > 0) {
                const invalidTokens: string[] = [];
                response.responses.forEach((resp: admin.messaging.SendResponse, idx: number) => {
                    if (!resp.success && resp.error) {
                        if (resp.error.code === 'messaging/invalid-registration-token' ||
                            resp.error.code === 'messaging/registration-token-not-registered') {
                            invalidTokens.push(tokens[idx]);
                        }
                    }
                });

                // Remove invalid tokens from database
                if (invalidTokens.length > 0) {
                    await this.removeInvalidTokens(userId, invalidTokens);
                }
            }

            return response.successCount > 0;
        } catch (error) {
            console.error('Error sending notification:', error);
            return false;
        }
    }

    /**
     * Remove invalid FCM tokens from database
     * Optimized: Uses bulk delete instead of individual destroys
     */
    private static async removeInvalidTokens(userId: string, invalidTokens: string[]): Promise<void> {
        if (!userId || invalidTokens.length === 0) return;

        try {
            const fcmRecords = await FCM.findAll({
                where: { user_id: userId },
                attributes: ['id', 'token']
            });

            const idsToDelete: string[] = [];
            for (const record of fcmRecords) {
                const tokenData = record.token as any;
                const token = (typeof tokenData === 'object' && tokenData?.token)
                    ? tokenData.token
                    : (typeof tokenData === 'string' ? tokenData : null);

                if (token && invalidTokens.includes(String(token))) {
                    idsToDelete.push(record.id);
                }
            }

            // Bulk delete for better performance
            if (idsToDelete.length > 0) {
                await FCM.destroy({
                    where: {
                        id: { [Op.in]: idsToDelete }
                    }
                });
                console.log(`Removed ${idsToDelete.length} invalid FCM token(s) for user ${userId}`);
            }
        } catch (error) {
            console.error('Error removing invalid tokens:', error);
        }
    }

    /**
     * Send notification to multiple users
     * Optimized: Sends notifications in parallel
     */
    static async sendNotificationToUsers(
        userIds: string[],
        payload: NotificationPayload
    ): Promise<number> {
        if (!userIds || userIds.length === 0) return 0;

        // Send notifications in parallel for better performance
        const results = await Promise.allSettled(
            userIds.map(userId => this.sendNotificationToUser(userId, payload))
        );

        return results.filter(
            (result): result is PromiseFulfilledResult<boolean> =>
                result.status === 'fulfilled' && result.value === true
        ).length;
    }

    /**
     * Send notification without blocking (fire and forget)
     * Use this when you don't want to wait for notification to complete
     */
    static sendNotificationAsync(
        userId: string,
        payload: NotificationPayload
    ): void {
        // Don't await - fire and forget
        this.sendNotificationToUser(userId, payload).catch(error => {
            console.error('Async notification failed:', error);
        });
    }
}

