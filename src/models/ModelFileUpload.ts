import { Model } from "BaseService/db/Model";

export class FileUpload {
  id: string;
  org_id: string;
  physical_path: string;
  relative_url: string;
  file_name: string;
  created_at: Date;
  updated_at: Date;
}

// tslint:disable-next-line: max-classes-per-file
export class ModelFileUpload extends Model<FileUpload> {
  public tableName: string = "file_uploads";
}
