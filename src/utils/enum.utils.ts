export enum Roles {
    ADMIN = "admin",
    USER = "user",
    VENDOR = "vendor",
    BARBER = "barber",
}


export enum Status {
    ACTIVE = "active",
    BLOCKED = "blocked",
    DEACTIVED = "de-activated",
    DISABLED = "disabled"
}



export enum DeviceType {
    MOBILE = "mobile",
    TABLET = "tablet",
    WEB = "web",
    DESKTOP = "desktop",
    TV = "tv",
    IOT = "iot",
    OTHER = "other"
}

export enum Platform {
    ANDROID = "android",
    IOS = "ios",
    MACOS = "macos",
    WINDOWS = "windows",
    LINUX = "linux",
    CHROMEOS = "chromebook",
    OTHER = "other"
}


export enum BrowserType {
    CHROME = "chrome",
    SAFARI = "safari",
    FIREFOX = "firefox",
    EDGE = "edge",
    OPERA = "opera",
    BRAVE = "brave",
    IE = "ie",
    OTHER = "other"
}


export enum TokenType {
    FCM = "fcm",
    APNS = "apns"
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    UNISEX = "unisex",
    OTHERS = "others"
}

export enum AppointmentStatus {
    Pending = "pending",
    Accepted = "accepted",
    InProgress = "in-prpgress",
    Rejected = "rejected",
    Conmpleted = "completed",
    Cancelled = "cancelled",
}


export enum PaymentStatus {
    Pending = "pending",
    Failed = "failed",
    Success = "succss"
}

export enum PaymentMode {
    Cash = "cash",
    Online = "online",
    Other = "Other"
}