class PriceBookUseCases {
  constructor({ priceBookRepository }) {
    this.priceBookRepository = priceBookRepository;
  }

  async getAllPriceBook() {
    return await this.priceBookRepository.getAll();
  }

  async createPriceBook(data) {
    return await this.priceBookRepository.create(data);
  }

  async deletePriceBook(id) {
    return await this.priceBookRepository.deleteUpdateEntity(id);
  }
}

module.exports = PriceBookUseCases;
