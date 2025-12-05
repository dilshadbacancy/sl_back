import { Model } from "sequelize";

export class Appointment extends Model {
    id!: string;
    user_id!: string;
    shop_id!: string;
    assigned_to!: string;
}