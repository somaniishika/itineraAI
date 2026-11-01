import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EmergencyContact } from '../entities/emergency-contact.entity';

@Injectable()
export class EmergencyContactRepository {
  private readonly repository: Repository<EmergencyContact>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(EmergencyContact);
  }

  async findByLocation(location: string): Promise<EmergencyContact | null> {
    return this.repository.findOne({ 
      where: { 
        location: location.toLowerCase()
      } 
    });
  }

  async saveEmergencyContacts(
    userId: number,
    location: string,
    contactDetails: Record<string, any>,
  ): Promise<EmergencyContact> {
    const contact = this.repository.create({ 
      user_id: userId,
      location: location.toLowerCase(),
      contact_details: contactDetails 
    });
    return this.repository.save(contact);
  }
}