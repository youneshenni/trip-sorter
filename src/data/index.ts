import data from "./data.json";
import validator from "./validator";

export default function getData() {
  try {
    return validator.parse(data);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
