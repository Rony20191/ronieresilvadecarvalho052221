import { PageRequest } from "../types/page";

export function buildParams(req: PageRequest): URLSearchParams {
    const params = new URLSearchParams();

    params.set("page", req.page.toString());
    params.set("size", req.size.toString());

    req.sorts.forEach(sort => {
        params.append("sort", `${sort.field},${sort.direction}`);
    });

    return params;
}
