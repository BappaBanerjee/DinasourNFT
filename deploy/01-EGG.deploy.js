module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const token = await deploy("EGGToken", {
    from: deployer,
    args: [deployer],
    log: true,
  });
  log(`EggToken deployed at ${token.address}`);
};
module.exports.tags = ["all", "EGGToken"];
