export interface StateData {
  name: string;
  code: string;
  districts: {
    name: string;
    cities: string[];
  }[];
}

export const INDIAN_LOCATIONS: StateData[] = [
  {
    name: 'Telangana',
    code: 'TG',
    districts: [
      {
        name: 'Hyderabad',
        cities: ['Central Zone', 'Secunderabad', 'Cyberabad / Gachibowli', 'Ameerpet', 'Khairatabad', 'Charminar Zone', 'Kukatpally', 'Jubilee Hills']
      },
      {
        name: 'Warangal / Hanamkonda',
        cities: ['Hanamkonda', 'Kazipet', 'Warangal City', 'Subedari', 'Narsampet', 'Jangaon Border']
      },
      {
        name: 'Rangareddy',
        cities: ['LB Nagar', 'Shamshabad', 'Rajendranagar', 'Ibrahimpatnam', 'Manikonda', 'Kondapur']
      },
      {
        name: 'Medchal-Malkajgiri',
        cities: ['Malkajgiri', 'Kukatpally Industrial Area', 'Uppal', 'Kompally', 'Medchal Town', 'Alwal']
      },
      {
        name: 'Karimnagar',
        cities: ['Karimnagar City', 'Huzurabad', 'Choppadandi', 'Manakondur']
      },
      {
        name: 'Nizamabad',
        cities: ['Nizamabad City', 'Armoor', 'Bodhan', 'Balkonda']
      },
      {
        name: 'Khammam',
        cities: ['Khammam City', 'Sathupalli', 'Wyra', 'Madhira']
      },
      {
        name: 'Nalgonda',
        cities: ['Nalgonda City', 'Miryalaguda', 'Deverakonda', 'Suryapet Border']
      },
      {
        name: 'Mahbubnagar',
        cities: ['Mahbubnagar Town', 'Jadcherla', 'Devarkadra', 'Badepalle']
      },
      {
        name: 'Sangareddy',
        cities: ['Sangareddy Town', 'Patancheru', 'Zaheerabad', 'RC Puram']
      }
    ]
  },
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    districts: [
      {
        name: 'Visakhapatnam',
        cities: ['Visakhapatnam City', 'Gajuwaka', 'Anakapalle', 'MVP Colony', 'Pendurthi']
      },
      {
        name: 'NTR / Vijayawada',
        cities: ['Vijayawada Central', 'Governorpet', 'Benz Circle', 'Gannavaram', 'Jaggayyapeta']
      },
      {
        name: 'Guntur',
        cities: ['Guntur City', 'Tenali', 'Narasaraopet', 'Mangalagiri']
      },
      {
        name: 'Tirupati',
        cities: ['Tirupati City', 'Srikalahasti', 'Gudur', 'Renigunta']
      },
      {
        name: 'East Godavari',
        cities: ['Kakinada', 'Rajahmundry', 'Amalapuram', 'Samalkot']
      },
      {
        name: 'Kurnool',
        cities: ['Kurnool Town', 'Nandyal', 'Adoni', 'Yemmiganur']
      },
      {
        name: 'Anantapur',
        cities: ['Anantapur City', 'Dharmavaram', 'Hindupur', 'Guntakal']
      },
      {
        name: 'Nellore',
        cities: ['Nellore City', 'Kavali', 'Gudur', 'Atmakur']
      }
    ]
  },
  {
    name: 'Karnataka',
    code: 'KA',
    districts: [
      {
        name: 'Bengaluru Urban',
        cities: ['Bengaluru Central', 'Indiranagar', 'Koramangala', 'Whitefield', 'Electronic City', 'Jayanagar', 'Yelahanka', 'HSR Layout']
      },
      {
        name: 'Mysuru',
        cities: ['Mysuru City', 'Nanjangud', 'Hunsur', 'T. Narsipur']
      },
      {
        name: 'Dakshina Kannada / Mangaluru',
        cities: ['Mangaluru City', 'Puttur', 'Bantwal', 'Surathkal']
      },
      {
        name: 'Belagavi',
        cities: ['Belagavi City', 'Gokak', 'Chikkodi', 'Khanapur']
      },
      {
        name: 'Hubballi-Dharwad',
        cities: ['Hubballi Central', 'Dharwad Town', 'Navanagar', 'Vidyanagar']
      },
      {
        name: 'Kalaburagi',
        cities: ['Kalaburagi City', 'Sedam', 'Chittapur', 'Aland']
      }
    ]
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    districts: [
      {
        name: 'Chennai',
        cities: ['Chennai Central', 'Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Tambaram', 'Guindy']
      },
      {
        name: 'Coimbatore',
        cities: ['Coimbatore City', 'RS Puram', 'Gandhipuram', 'Pollachi', 'Mettupalayam']
      },
      {
        name: 'Madurai',
        cities: ['Madurai City', 'Melur', 'Thiruparankundram', 'Usilampatti']
      },
      {
        name: 'Tiruchirappalli',
        cities: ['Trichy Central', 'Srirangam', 'Thiruverumbur', 'Lalgudi']
      },
      {
        name: 'Salem',
        cities: ['Salem City', 'Attur', 'Mettur', 'Omalur']
      }
    ]
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    districts: [
      {
        name: 'Mumbai City',
        cities: ['South Mumbai', 'Fort / Nariman Point', 'Dadar', 'Bandra', 'Andheri', 'Borivali', 'Ghatkopar']
      },
      {
        name: 'Pune',
        cities: ['Pune City', 'Kothrud', 'Viman Nagar', 'Hinjawadi', 'Pimpri-Chinchwad', 'Hadapsar', 'Baner']
      },
      {
        name: 'Thane',
        cities: ['Thane West', 'Kalyan', 'Dombivli', 'Navi Mumbai / Vashi', 'Mira-Bhayandar']
      },
      {
        name: 'Nagpur',
        cities: ['Nagpur City', 'Sitabuldi', 'Dharampeth', 'Kamptee', 'Hingna']
      },
      {
        name: 'Nashik',
        cities: ['Nashik City', 'Panchavati', 'Cidco', 'Malegaon', 'Deolali']
      }
    ]
  },
  {
    name: 'Delhi NCR',
    code: 'DL',
    districts: [
      {
        name: 'New Delhi',
        cities: ['Connaught Place', 'Chanakyapuri', 'Vasant Kunj', 'Saket', 'Lajpat Nagar']
      },
      {
        name: 'North Delhi',
        cities: ['Civil Lines', 'Pitampura', 'Rohini', 'Model Town']
      },
      {
        name: 'South Delhi',
        cities: ['Hauz Khas', 'Greater Kailash', 'Nehru Place', 'Badarpur']
      },
      {
        name: 'East Delhi',
        cities: ['Laxmi Nagar', 'Preet Vihar', 'Mayur Vihar', 'Shahdara']
      }
    ]
  },
  {
    name: 'Kerala',
    code: 'KL',
    districts: [
      {
        name: 'Thiruvananthapuram',
        cities: ['Thiruvananthapuram City', 'Kowdiar', 'Technopark', 'Neyyattinkara', 'Varkala']
      },
      {
        name: 'Ernakulam / Kochi',
        cities: ['Kochi / Ernakulam', 'Kakkanad', 'Fort Kochi', 'Aluva', 'Perumbavoor']
      },
      {
        name: 'Kozhikode',
        cities: ['Kozhikode City', 'Mavoor', 'Vadakara', 'Koyilandy']
      }
    ]
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    districts: [
      {
        name: 'Ahmedabad',
        cities: ['Ahmedabad Central', 'Navrangpura', 'Satellite / SG Highway', 'Maninagar', 'Bodal']
      },
      {
        name: 'Surat',
        cities: ['Surat City', 'Adajan', 'Varachha', 'Vesu', 'Udhna']
      },
      {
        name: 'Vadodara',
        cities: ['Vadodara City', 'Alkapuri', 'Sayajiganj', 'Makarpura']
      }
    ]
  },
  {
    name: 'West Bengal',
    code: 'WB',
    districts: [
      {
        name: 'Kolkata',
        cities: ['Central Kolkata', 'Salt Lake / Sector V', 'Park Street', 'New Town', 'Bhowanipore', 'Behala']
      },
      {
        name: 'North 24 Parganas',
        cities: ['Barasat', 'Barrackpore', 'Bidhannagar', 'Bangar']
      },
      {
        name: 'Howrah',
        cities: ['Howrah City', 'Bally', 'Shibpur', 'Uluberia']
      }
    ]
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    districts: [
      {
        name: 'Lucknow',
        cities: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Indira Nagar', 'Chowk']
      },
      {
        name: 'Gautam Buddha Nagar / Noida',
        cities: ['Noida Sector 18', 'Noida Sector 62', 'Greater Noida', 'Expressway']
      },
      {
        name: 'Kanpur Nagar',
        cities: ['Civil Lines', 'Kidwai Nagar', 'Kalyanpur', 'Swaroop Nagar']
      },
      {
        name: 'Varanasi',
        cities: ['Varanasi City', 'Godowlia', 'Lanka', 'Cantt']
      }
    ]
  },
  {
    name: 'Punjab',
    code: 'PB',
    districts: [
      {
        name: 'Ludhiana',
        cities: ['Ludhiana City', 'Model Town', 'Sarabha Nagar', 'Ferozepur Road']
      },
      {
        name: 'Amritsar',
        cities: ['Amritsar City', 'Ranjit Avenue', 'Golden Temple Zone', 'Lawrence Road']
      },
      {
        name: 'SAS Nagar / Mohali',
        cities: ['Mohali Phase 7', 'Mohali Phase 10', 'Sector 70', 'Kharar']
      }
    ]
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    districts: [
      {
        name: 'Jaipur',
        cities: ['C-Scheme', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Raja Park']
      },
      {
        name: 'Jodhpur',
        cities: ['Jodhpur City', 'Sardarpura', 'Ratanada', 'Shastri Nagar']
      },
      {
        name: 'Udaipur',
        cities: ['Udaipur City', 'Hiran Magri', 'Fatehpura', 'Panchwati']
      }
    ]
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    districts: [
      {
        name: 'Indore',
        cities: ['Vijay Nagar', 'Palasia', 'Rajwada', 'Bhawarkua', 'Rau']
      },
      {
        name: 'Bhopal',
        cities: ['MP Nagar', 'Arera Colony', 'New Market', 'Bairagarh']
      }
    ]
  },
  {
    name: 'Haryana',
    code: 'HR',
    districts: [
      {
        name: 'Gurugram',
        cities: ['Cyber City', 'Golf Course Road', 'DLF Phase 3', 'Sohna Road', 'Sector 56']
      },
      {
        name: 'Faridabad',
        cities: ['Faridabad Central', 'Sector 15', 'NIT Faridabad', 'Ballabgarh']
      }
    ]
  },
  {
    name: 'Assam',
    code: 'AS',
    districts: [
      {
        name: 'Kamrup Metropolitan / Guwahati',
        cities: ['Guwahati Central', 'Dispur', 'GS Road', 'Paltan Bazar', 'Ganeshguri']
      }
    ]
  },
  {
    name: 'Goa',
    code: 'GA',
    districts: [
      {
        name: 'North Goa',
        cities: ['Panaji', 'Mapusa', 'Calangute', 'Porvorim']
      },
      {
        name: 'South Goa',
        cities: ['Margao', 'Vasco da Gama', 'Ponda']
      }
    ]
  }
];

const CACHED_STATES = INDIAN_LOCATIONS.map(s => ({ name: s.name, code: s.code }));

// Pre-index location hierarchy for O(1) lookup performance
const LOCATION_INDEX = new Map<string, {
  districts: string[];
  citiesByDistrict: Map<string, string[]>;
}>();

for (const state of INDIAN_LOCATIONS) {
  const normState = state.name.toLowerCase();
  const districts = state.districts.map(d => d.name);
  const citiesByDistrict = new Map<string, string[]>();
  
  for (const dist of state.districts) {
    citiesByDistrict.set(dist.name.toLowerCase(), dist.cities);
  }
  
  LOCATION_INDEX.set(normState, {
    districts,
    citiesByDistrict
  });
}

export const locationDataService = {
  getStates(): { name: string; code: string }[] {
    return CACHED_STATES;
  },

  getDistricts(stateName: string): string[] {
    if (!stateName) return [];
    const stateData = LOCATION_INDEX.get(stateName.toLowerCase());
    return stateData ? stateData.districts : [];
  },

  getCities(stateName: string, districtName: string): string[] {
    if (!stateName || !districtName) return [];
    const stateData = LOCATION_INDEX.get(stateName.toLowerCase());
    if (!stateData) return [];
    return stateData.citiesByDistrict.get(districtName.toLowerCase()) || [];
  }
};
