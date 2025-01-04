

export function formatError(error:any){
  if(error?.name === "ZodError"){
    const fieldError = Object.keys(error?.errors)?.map(field=> error?.errors[field]?.message);

    return fieldError?.join('. ')
  }else if(error?.name === "PrismaClientKnownRequestError" && error?.code === "P2002"){
    const field = error?.meta?.target ? error?.meta?.target[0] : 'Field';
    return `${field?.charAt(0)?.toUpperCase() + field?.slice(1)} already exist`
  }else{
    return typeof error?.message === "string"? error?.message : JSON.stringify(error?.message);
  }
}