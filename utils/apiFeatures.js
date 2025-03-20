class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObject = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields", "keyword"];
    excludeFields.forEach((field) => delete queryStringObject[field]);

    // Apply filtering for (gte, lte, gt, lt)
    let editedQueryString = JSON.stringify(queryStringObject);
    editedQueryString = editedQueryString.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`
    );
    editedQueryString = JSON.parse(editedQueryString);
    this.mongooseQuery = this.mongooseQuery.find(editedQueryString);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  paginate(totalDocs) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;
    const lastDoc = page * limit;
    const numberOfPages = Math.max(Math.ceil(totalDocs / limit), 1);

    let pagination = {
      limit,
      totalDocs,
      numberOfPages,
      currentPage: page,
    };

    if (totalDocs === 0) {
      pagination.message = "No documents found.";
      pagination.numberOfPages = 0;
    } else if (page > numberOfPages) {
      pagination.message =
        "The number of pages you entered is greater than the number of existing pages.";
    } else {
      if (lastDoc < totalDocs) pagination.nextPage = page + 1;
      if (skip > 0) pagination.previousPage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
    this.paginationResult = pagination;
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const query = {};
      query.$or = [
        { name: { $regex: this.queryString.keyword, $options: "i" } },
        { description: { $regex: this.queryString.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
}

module.exports = ApiFeatures;
