const clientRepository = require("../../repositories/clientRepository");



const updateClientUseCase = async(req, res) =>{
  const { id, name, email, password, active, phoneNumbers, adr_type, nick, street, number, complement, neighborhood, city, state, country, zipcode, is_default  } = req.body;

  const addresses = adr_type.map((type, i) => ({
      adr_type: type,
      is_default: is_default && is_default[i] === 'true', 
      nick: nick[i] || '',
      street: street[i] || '',
      number: number[i] || '',
      complement: complement[i] || '',
      neighborhood: neighborhood[i] || '',
      city: city[i] || '',
      state: state[i] || '',
      country: country[i] || '',
      zipcode: zipcode[i] || ''
  }));
  
  try {
      // Atualiza os dados do cliente no repositório
      console.log({id, name, email, password, active, phoneNumbers, addresses});

      const client = await clientRepository.updateClient(id, name, email, password, active, phoneNumbers, addresses);
      console.log("aaaaa")
      console.log(client)
      return client;
  }
  catch{
    return null;
  }

}

module.exports = updateClientUseCase;
