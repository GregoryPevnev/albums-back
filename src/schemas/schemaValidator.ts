import { ValidateFunction } from "ajv";
import { getValidationError } from "../application/common/errors";

const getSchemaValidator = (schema: ValidateFunction) => (data: any): any => {
    if (schema(data)) return data;
    else throw getValidationError(schema.errors.map(err => err.message));
};

export default getSchemaValidator;
