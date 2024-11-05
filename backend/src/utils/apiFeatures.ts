import { Document, Query } from "mongoose";

interface QueryString {
    keyword?: string;
    page?: string;
    limit?: string;
    [key: string]: any;
}

class ApiFeatures<T extends Document> {
    query: Query<T[], T>;
    queryStr: QueryString;

    constructor(query: Query<T[], T>, queryStr: QueryString) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                email: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                },
            } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    searchEvent() {
        const keyword = this.queryStr.keyword
            ? {
                title: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                },
            } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        const removeFields = [ "keyword", "page", "limit" ];
        removeFields.forEach((key) => delete queryCopy[key]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage: number) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default ApiFeatures;