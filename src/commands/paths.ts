import { Command } from "@oclif/core";
import getData from "../data";

class GetPaths extends Command {
  static description = "Get the list of paths";

  async run() {
    const paths = getData();
  }
}
