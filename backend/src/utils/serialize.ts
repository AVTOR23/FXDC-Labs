export function toClient<T extends Record<string, unknown>>(doc: T) {
  const { _id, __v, isDeleted, passwordHash, ...rest } = doc;
  return {
    id: String(_id),
    ...rest,
  };
}

export function paginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}
