import { IBaseServiceQuery } from "BaseService/interfaces/common";

// tslint:disable-next-line: no-namespace
export namespace IFile {
  export const DeleteFileSchema = {
    $$strict: true,
    fileNames: { type: "array", items: "string", optional: true },
    ids: { type: "array", items: "uuid", optional: true },
  };
}
