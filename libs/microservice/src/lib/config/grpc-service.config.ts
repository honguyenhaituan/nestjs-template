import { IsDefined, IsInt, IsOptional, IsString } from 'class-validator';

export class GrpcServiceOption {
  @IsString()
  @IsDefined()
  endpoint?: string;

  @IsOptional()
  @IsInt()
  maxRetries?: number;
}
