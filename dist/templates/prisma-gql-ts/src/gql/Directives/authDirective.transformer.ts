import { GraphQLSchema } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";
import { UNAUTHENTICATED } from "constants/ErrorCodes";
export default (schema: GraphQLSchema, directiveName: string) => {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (authDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (source, args, context, info) {
          if (context.user) {
            const result = await resolve(source, args, context, info);
            return result;
          }
          return UNAUTHENTICATED;
        };
        return fieldConfig;
      }
    },
  });
};
