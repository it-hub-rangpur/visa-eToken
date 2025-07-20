// // import dbConnection from "../../lib/dbConnection";

import { NextRequest } from "next/server";
import errorHandler from "../ErrorHandelars";

// import errorHandler from "../ErrorHandelars";

// const catchAsync =
//   (handler: (req: Request, res?: Response) => void) =>
//   async (req: Request, res: Response) => {
//     try {
//       //   await dbConnection();
//       return await handler(req, res);
//     } catch (error) {
//       return errorHandler(error as Error);
//     }
//   };

// export default catchAsync;

export function catchAsync<T>(handler: (req: NextRequest) => Promise<T>) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      return errorHandler(error as Error);
    }
  };
}
