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

export enum AddressType {
    HOME = "home",
    OFFICR = "office",
    OTHER = "others"
}


export enum PaymentMethods {
    CARD = 'card',
    WALLET = "wallet",
    UPI = "upi",
    COD = "cod"
}

export enum ProductType {
    GROCERY = "grocery",
    ACCESSORIES = "accessories",
    VEGETABLE = "vegetable",
    FRUIT = "fruit",
    DAIRY = "dairy",
    MEAT = "meat",
    SEAFOOD = "seafood",
    BEVERAGE = "beverage",
    SNACK = "snack",
    BAKERY = "bakery",
    FROZEN = "frozen",
    PERSONAL_CARE = "personal_care",
    HOME_CARE = "home_care",
    BABY_CARE = "baby_care",
    PET_CARE = "pet_care"
}


export enum CategoryType {
    // Vegetables
    LEAFY_VEGETABLES = "leafy_vegetables",
    ROOT_VEGETABLES = "root_vegetables",
    EXOTIC_VEGETABLES = "exotic_vegetables",
    MOBILES = "mobiles",
    HEADPHONES = "headphones",
    OTHERS = "Others",

    // Fruits
    CITRUS_FRUITS = "citrus_fruits",
    BERRIES = "berries",
    TROPICAL_FRUITS = "tropical_fruits",

    // Dairy
    MILK = "milk",
    CHEESE = "cheese",
    BUTTER_GHEE = "butter_ghee",
    CURD_YOGURT = "curd_yogurt",

    // Meat & Seafood
    CHICKEN = "chicken",
    MUTTON = "mutton",
    FISH = "fish",
    PRAWNS = "prawns",

    // Grocery Essentials
    ATTA_FLOURS = "atta_flours",
    RICE = "rice",
    DAL_PULSES = "dal_pulses",
    OILS = "oils",
    SPICES = "spices",
    DRY_FRUITS = "dry_fruits",
    SALT_SUGAR = "salt_sugar",

    // Snacks & Beverages
    SOFT_DRINKS = "soft_drinks",
    JUICES = "juices",
    CHIPS = "chips",
    BISCUITS = "biscuits",
    NAMKEEN = "namkeen",

    // Frozen
    FROZEN_VEG = "frozen_veg",
    FROZEN_SNACKS = "frozen_snacks",

    // Non-Food
    HAIR_CARE = "hair_care",
    SKIN_CARE = "skin_care",
    ORAL_CARE = "oral_care",
    HOME_CLEANING = "home_cleaning",
    LAUNDRY = "laundry",
    BABY_FOOD = "baby_food",
    DIAPERS = "diapers",
    PET_FOOD = "pet_food"
}


export enum OrderStatus {
    PLACED = "placed",
    PENDING = "pending",
    DELIVERED = "delivered",
    SHIPPED = "shipped",
    CANCELED = "canceled",
}

export enum OrderReturnStatus {
    PENDING = "pending",
    APRROVED = "approved",
    ONHOLD = "on-hold",
    REJECTED = "rejected",
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