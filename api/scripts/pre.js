module.exports = async (runner, args) => {
  try {
    console.log("> PRE: Installing prerequisites (API):");

    const rc = args.rc;
    await runner.execute(
      [
        `nx g @nrwl/nest:app ${rc.path}`,
        "npm i ---save mongoose",
        "npm i ---save @nestjs/mongoosee",
        "npm i ---save @nestjs-plus/discovery",
        "npm i --save @nestjs/microservices@8.4.7",
        "npm i --save lodash",
        "npm i --save class-validator class-transformer",
      ],
      {
        cwd: rc.workspace_path,
      }
    );

    console.log("> PRE: requisites ✅ DONE");
  } catch {
    console.error(ex);
    throw new Error("failed to install api pre-requisites");
  }
};
