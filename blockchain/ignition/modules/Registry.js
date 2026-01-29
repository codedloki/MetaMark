const { buildModule } =require('@nomicfoundation/hardhat-ignition/modules')

module.exports =  buildModule("RegistryModule",(m)=>{
  const registry = m.contract("Registry");
  return { registry } ;

})

