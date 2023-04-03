import { IsInt, IsOptional } from 'class-validator';

export class ServerOption {
  @IsInt()
  @IsOptional()
  httpPort: number;

  @IsInt()
  @IsOptional()
  grpcPort?: number;

  @IsInt()
  @IsOptional()
  socketPort?: number;
}
