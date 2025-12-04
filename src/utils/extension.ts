// src/utils/string.extensions.ts
export { }; // make it a module

declare global {
    interface String {
        capitalize(): string;
        capitalizeWords(): string;
    }
}

String.prototype.capitalize = function (): string {
    if (!this) return "";
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.capitalizeWords = function (): string {
    return this.replace(/\b\w/g, (char) => char.toUpperCase());
};
