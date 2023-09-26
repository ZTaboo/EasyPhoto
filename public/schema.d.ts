export { ConfigSchema, Config, validateConfig };
import { z } from 'zod';
declare const ConfigSchema: z.ZodDefault<z.ZodObject<{
    publicPath: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    debug: z.ZodDefault<z.ZodBoolean>;
    proxyToWorker: z.ZodDefault<z.ZodBoolean>;
    fetchArgs: z.ZodDefault<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
    progress: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodString, z.ZodNumber, z.ZodNumber], z.ZodUnknown>, z.ZodUndefined>>;
    model: z.ZodDefault<z.ZodEnum<["small", "medium"]>>;
}, "strip", z.ZodTypeAny, {
    debug: boolean;
    proxyToWorker: boolean;
    fetchArgs: {};
    model: "small" | "medium";
    publicPath?: string | undefined;
    progress?: ((args_0: string, args_1: number, args_2: number, ...args_3: unknown[]) => undefined) | undefined;
}, {
    publicPath?: string | undefined;
    debug?: boolean | undefined;
    proxyToWorker?: boolean | undefined;
    fetchArgs?: {} | undefined;
    progress?: ((args_0: string, args_1: number, args_2: number, ...args_3: unknown[]) => undefined) | undefined;
    model?: "small" | "medium" | undefined;
}>>;
type Config = z.infer<typeof ConfigSchema>;
declare function validateConfig(config?: Config): Config;
