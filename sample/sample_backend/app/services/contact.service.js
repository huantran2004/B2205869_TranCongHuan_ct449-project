// app/services/contact.service.js
const { ObjectId } = require("mongodb");

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

  // Lọc các field hợp lệ và bỏ undefined
  extractContactData(payload = {}) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };
    Object.keys(contact).forEach((k) => contact[k] === undefined && delete contact[k]);
    return contact;
  }

  // CREATE (upsert theo slide)
  async create(payload) {
    const contact = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      contact,
      { $set: { favorite: contact.favorite === true } },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  // FIND many theo filter
  async find(filter = {}) { 
    const cursor = await this.Contact.find(filter);
    return await cursor.toArray();
  }

  // FIND by name (regex, i)
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  // FIND by id (1 document)
  async findById(id) {
    return await this.Contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // UPDATE by id (trả doc sau update)
  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const update = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  // DELETE by id (trả doc đã xóa)
  async delete(id) {
    const result = await this.Contact.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async findAllFavorite() {
    return await this.find({favorite: true});
  }

  async deleteAll() {
    const result = await this.Contact.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ContactService;
