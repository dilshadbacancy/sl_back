import { AppointmentStatus } from '../../utils/enum.utils';

interface NotificationData {
    title: string;
    message: string;
    data: Record<string, any>;
}

/**
 * Helper class to build notification payloads for appointment-related events
 */
export class NotificationBuilder {
    // private static readonly STATUS_LABELS: Record<string, string> = {
    //     'pending': 'Pending',
    //     'accepted': 'Accepted',
    //     'rejected': 'Rejected',
    //     'cancelled': 'Cancelled',
    //     'inProgress': 'In Progress',
    //     'completed': 'Completed',
    //     'conmpleted': 'Completed' // Handle typo in enum
    // };

    /**
     * Get formatted status label
     */

    private static readonly statusMap = Object.values(AppointmentStatus).reduce(
        (acc, value) => {
            acc[value] = value
                .replace("-", " ")
                .replace(/\b\w/g, char => char.toUpperCase());
            return acc;
        },
        {} as Record<string, string>
    );
    private static getStatusLabel(status: string): string {
        return this.statusMap[status.toLowerCase()] || status;
    }

    /**
     * Format customer name from user object
     */
    private static formatCustomerName(customer: any): string {
        if (!customer) return 'Customer';
        const firstName = customer.first_name || '';
        const lastName = customer.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName || 'Customer';
    }

    /**
     * Format service names from array
     */
    private static formatServiceNames(services: any[]): string {
        if (!Array.isArray(services) || services.length === 0) return '';

        return services
            .map((s: any) => {
                if (typeof s === 'string') return s;
                if (s?.name) return s.name;
                if (s?.service?.name) return s.service.name;
                return null;
            })
            .filter(Boolean)
            .join(', ');
    }

    /**
     * Format date to ISO string safely
     */
    private static formatDate(date: Date | string | null | undefined): string {
        if (!date) return '';
        try {
            return new Date(date).toISOString();
        } catch {
            return '';
        }
    }

    /**
     * Build notification for when customer books appointment
     */
    static buildBookingNotification(
        customer: any,
        serviceNames: string[],
        appointmentId: string,
        appointmentDate: Date | string
    ): NotificationData {
        const customerName = this.formatCustomerName(customer);
        const services = this.formatServiceNames(serviceNames);

        return {
            title: 'New Appointment Booking',
            message: `${customerName} has booked an appointment`,
            data: {
                customerId: customer?.id || '',
                customerName: customerName,
                serviceName: services,
                appointmentId: appointmentId,
                appointmentDate: this.formatDate(appointmentDate),
                status: AppointmentStatus.Pending.toLowerCase()
            }
        };
    }

    /**
     * Build notification for when vendor accepts appointment
     */
    static buildAcceptanceNotification(
        shop: any,
        serviceNames: string[],
        appointmentId: string,
        appointmentDate: Date | string,
        expectedStart: Date,
        barber: any
    ): NotificationData {
        const vendorName = shop?.shop_name || 'Vendor';
        const services = this.formatServiceNames(serviceNames);

        return {
            title: 'Appointment Accepted',
            message: `${vendorName} has accepted your appointment`,
            data: {
                vendorId: shop?.user_id || '',
                vendorName: vendorName,
                service: services,
                status: 'accepted',
                estimatedTime: this.formatDate(expectedStart),
                appointmentDate: this.formatDate(appointmentDate),
                appointmentId: appointmentId,
                barberId: barber?.id || '',
                barberName: barber?.name || 'Barber'
            }
        };
    }

    /**
     * Build notification for status change (customer changed)
     */
    static buildStatusChangeNotificationForVendor(
        customer: any,
        serviceNames: string[],
        status: string,
        appointmentId: string,
        appointmentDate: Date | string | null,
        expectedStart: Date | string | null
    ): NotificationData {
        const customerName = this.formatCustomerName(customer);
        const services = this.formatServiceNames(serviceNames);
        const statusLabel = this.getStatusLabel(status);

        return {
            title: 'Appointment Status Updated',
            message: `${customerName} has ${statusLabel.toLowerCase()} the appointment`,
            data: {
                customerId: customer?.id || '',
                customerName: customerName,
                service: services,
                status: status.toLowerCase(),
                appointmentDate: this.formatDate(appointmentDate),
                appointmentId: appointmentId,
                estimatedTime: this.formatDate(expectedStart),
                changedBy: 'customer'
            }
        };
    }

    /**
     * Build notification for status change (vendor changed)
     */
    static buildStatusChangeNotificationForCustomer(
        shop: any,
        serviceNames: string[],
        status: string,
        appointmentId: string,
        appointmentDate: Date | string | null,
        expectedStart: Date | string | null
    ): NotificationData {
        const vendorName = shop?.shop_name || 'Vendor';
        const services = this.formatServiceNames(serviceNames);
        const statusLabel = this.getStatusLabel(status);

        return {
            title: 'Appointment Status Updated',
            message: `${vendorName} has ${statusLabel.toLowerCase()} your appointment`,
            data: {
                vendorId: shop?.user_id || '',
                vendorName: vendorName,
                service: services,
                status: status.toLowerCase(),
                appointmentDate: this.formatDate(appointmentDate),
                appointmentId: appointmentId,
                estimatedTime: this.formatDate(expectedStart),
                changedBy: 'vendor'
            }
        };
    }

    /**
     * Build generic status change notification (unknown who changed)
     */
    static buildGenericStatusChangeNotification(
        serviceNames: string[],
        status: string,
        appointmentId: string,
        appointmentDate: Date | string | null,
        expectedStart: Date | string | null,
        isForCustomer: boolean,
        customer?: any,
        shop?: any
    ): NotificationData {
        const services = this.formatServiceNames(serviceNames);
        const statusLabel = this.getStatusLabel(status);

        if (isForCustomer) {
            const vendorName = shop?.shop_name || 'Vendor';
            return {
                title: 'Appointment Status Updated',
                message: `Appointment status changed to ${statusLabel}`,
                data: {
                    vendorId: shop?.user_id || '',
                    vendorName: vendorName,
                    service: services,
                    status: status.toLowerCase(),
                    appointmentDate: this.formatDate(appointmentDate),
                    appointmentId: appointmentId,
                    estimatedTime: this.formatDate(expectedStart)
                }
            };
        } else {
            const customerName = this.formatCustomerName(customer);
            return {
                title: 'Appointment Status Updated',
                message: `Appointment status changed to ${statusLabel}`,
                data: {
                    customerId: customer?.id || '',
                    customerName: customerName,
                    service: services,
                    status: status.toLowerCase(),
                    appointmentDate: this.formatDate(appointmentDate),
                    appointmentId: appointmentId,
                    estimatedTime: this.formatDate(expectedStart)
                }
            };
        }
    }
}

