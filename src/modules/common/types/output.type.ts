// Output inspired by `GO lang` where function always returns the data and an error
// https://blog.golang.org/error-handling-and-go
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
interface Output<T> {
  data?: T;
  error?: Error;
}

export { Output };
