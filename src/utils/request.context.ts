import { AsyncLocalStorage } from "async_hooks";
import { Request, Response } from "express";

interface Store {
    req: Request;
    res: Response;
}

export const requestContext = new AsyncLocalStorage<Store>();

export const getContext = () => requestContext.getStore();
