import { loader } from "../unclaimed";
import { installGlobals } from "@remix-run/node";

beforeAll(() => {
  // This installs globals such as "fetch", "Response", "Request" and "Headers".
  installGlobals();
});

describe("Unclaimed page Loader", () => {
  it("should return a response", async () => {
    const reqParams = {
      network: "arbitrum",
      address: "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5",
    };

    const response = await loader({
      request: new Request(`http://app.com/?address=${reqParams.address}`),
      params: {
        network: reqParams.network,
      },
      context: {},
    });

    expect(response).toBeInstanceOf(Response);
  });
});
