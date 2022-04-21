module.exports = class APIFeatures {
  /**
   * @param {Object} query the query object that we are mutating and executing at the end (e.g. Product.find() )
   * @param {Object} reqQuery req.query object
   */
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const reqQueryObj = { ...this.reqQuery };
    ['sort', 'fields', 'page', 'limit'].forEach((el) => delete reqQueryObj[el]);
    const reqQueryStr = JSON.stringify(reqQueryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query.find(JSON.parse(reqQueryStr));
    return this;
  }

  sort() {
    const sortBy = this.reqQuery.sort
      ? this.reqQuery.sort.split(',').join(' ')
      : '-createdAt';

    this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    const fields = this.reqQuery.fields
      ? this.reqQuery.fields.split(',').join(' ')
      : '-__v';

    this.query.select(fields);
    return this;
  }

  paginate() {
    const page = this.reqQuery.page || 1;
    const limit = this.reqQuery.limit || 10;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);
    return this;
  }
};
