export function mapFailureKind(error){
 return /WebGL|GPUInitializationError|Failed to initialize (?:GPU|graphics)/i.test(`${error?.name||''} ${error?.message||''}`)?'unsupported':'load';
}
