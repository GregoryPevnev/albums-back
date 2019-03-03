import AJV from "ajv";
import getSchemaLoader from "./loader";
import getSchemaValidator from "./schemaValidator";
import Validators from "../application/services/validation";

const EXTRA_SCHEMAS = ["song"];
const VALIDATON_SCHEMAS = ["album", "review", "signIn", "signUp", "details"];

const getValidators = async (schemasPath: string): Promise<Validators> => {
    const loader = getSchemaLoader(schemasPath);
    const ajv = new AJV({
        allErrors: true,
        useDefaults: true,
        coerceTypes: true,
        schemaId: "$id"
    });

    const extraSchemas = await Promise.all(EXTRA_SCHEMAS.map(loader));
    extraSchemas.forEach(schema => ajv.addSchema(schema));

    const [albumSchema, reviewSchema, signInSchema, signUpSchema, detailsSchema] = await Promise.all(
        VALIDATON_SCHEMAS.map(loader)
    ).then(schemas => schemas.map(schema => ajv.compile(schema)));

    return {
        validateSignUp: getSchemaValidator(signUpSchema),
        validateSignIn: getSchemaValidator(signInSchema),
        validateAlbum: getSchemaValidator(albumSchema),
        validateReview: getSchemaValidator(reviewSchema),
        validateDetails: getSchemaValidator(detailsSchema)
    };
};

export default getValidators;
