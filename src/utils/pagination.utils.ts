export class PaginationUtils {
    static getPagination(query: any): PaginationReqMeta {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.min(100, parseInt(query.limit) || 10);
        const offset = (page - 1) * limit;
        const meta: PaginationReqMeta = { page, limit, offset };;
        return meta
    }

    static getMetaData(value: any, query: any): Record<string, any> | null {
        const meta = {
            count: value.count,
            limit: query.limit,
            page: query.page,
            totalPages: Math.ceil(value.count / query.limit),
        }
        return meta;
    }
}

export interface PaginationReqMeta {
    page: number,
    limit: number,
    offset: number,
}
