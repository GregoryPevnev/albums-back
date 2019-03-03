import AJV from "ajv";

const getAJV = () =>
    new AJV({
        allErrors: true,
        useDefaults: true,
        coerceTypes: true,
        schemaId: "$id"
    });

export default getAJV;
