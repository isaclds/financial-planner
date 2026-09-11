interface BodyResponse {
  success: boolean;
  status: number;
  title: string;
  data: unknown;
}

export default function createBodyResponse(
  success: boolean,
  status: number,
  title: string,
  data: unknown,
): BodyResponse {
  return {
    success,
    status,
    title,
    data,
  };
}
