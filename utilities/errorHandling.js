export const successResponse = (res, message) => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message,
  });
};

export const successResponseWithData = (res, message, data) => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message,
    data, // Fixed typo (was "date")
  });
};

export const failureResponse = (res, message) => {
  return res.status(400).json({
    success: false,
    statusCode: 400,
    message,
  });
};

export const failureResponseWithData = (res, message, error) => {
  return res.status(400).json({
    success: false,
    statusCode: 400,
    message,
    error,
  });
};
