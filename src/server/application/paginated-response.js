exports.PaginatedResponse = class PaginatedResponse {
  constructor(pageIndex, pageSize, count, data) {
    this.pageIndex = pageIndex
    this.pageSize = pageSize
    this.count = count
    this.data = data

    this.totalPages = Math.ceil(count / pageSize)
  }
}
