export const VOUCHER_LOCATIONS = [
  'Shimla',
  'Cochin',
  'Jim Corbett',
  'Jaipur',
  'Agra',
  'Goa',
  'Nainital',
  'Manesar',
] as const;

export const VOUCHER_BENEFITS = [
  '₹10,000 Holiday Voucher',
  '₹500 Movie Voucher',
  '2 Nights / 3 Days Holiday Voucher',
  'Custom',
] as const;

export const DEFAULT_TERMS_AND_CONDITIONS = `HOLIDAY GIFT VOUCHER

1. Holiday Destination
Shimla
Cochin
Jim Corbett
Jaipur
Agra
Goa
Nainital
Manesar

2. 1 Year Validity.
*Locations and properties are timely amended.
*Booking is purely subject to availability as per the off-peak season.

3. The accommodation is in respect of a studio unit, which accommodates 2 adults and two kids below 6 years (same bed) occupancy cannot be exceeded. Food and travel expenses to be borne by the recipient.
It will expire in one year from the date of issuance.

4. The voucher allows you to experience Mandarin Worldwide Vacations associates properties. This offer is for off peak accommodation which is defined by each resort.

5. Reservation for 2 Nights can be done on 15 working days prior notification.
Reservation against movie voucher can be done on 7 working days prior notification.
The movie tickets will be available only for Monday to Thursday, not available for Friday to Sunday and gazetted holidays.

6. Utility charges are applicable for accommodation of 2 nights (off-peak).

7. The voucher of Rs. 10,000 is valid for international packages only.
For booking enquiry mail us at: packages@mandarinworldwidevacations.com
or visit: www.mandarinworldwidevacations.com

8. Once the accommodation request is confirmed the utility charges are non refundable.
If any government tax are there in a respective country, the same has to be borne by the recipient of this voucher.

9. All accommodations are subject to availability.
This Voucher is to be produced to confirm the accommodation and guests are expected to produce the confirmation voucher and a photo identification issued by Govt. / State while checking into the resorts.
The Management reserves the right to offer alternative accommodation from the one stipulated on the confirmation letter.
This voucher is not transferable, cannot be exchanged for cash and if not availed within the stipulated period will lapse.

To redeem this voucher, visit:
https://mwvpl.com/redeem-voucher
or email:
voucher@mandarinworldwidevacations.com

We hope to see you at the resorts.
HAPPY HOLIDAYING

Thanks & Regards
Mandarin Worldwide Vacations
Thanks For Visiting Mandarin Worldwide Vacations.`;

export const VOUCHER_ERRORS = {
  NOT_FOUND: 'Voucher not found',
  INVALID_VOUCHER: 'Invalid voucher number.',
  EXPIRED: 'This voucher has expired.',
  ALREADY_REDEEMED: 'This voucher has already been redeemed.',
  SUCCESS_REDEMPTION: 'Your voucher has been redeemed successfully.',
  DUPLICATE_NUMBER: 'A voucher with this voucher number already exists.',
};
