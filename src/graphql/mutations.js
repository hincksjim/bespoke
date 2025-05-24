/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPayment = /* GraphQL */ `
  mutation CreatePayment(
    $input: CreatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    createPayment(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePayment = /* GraphQL */ `
  mutation UpdatePayment(
    $input: UpdatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    updatePayment(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePayment = /* GraphQL */ `
  mutation DeletePayment(
    $input: DeletePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    deletePayment(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createNotes = /* GraphQL */ `
  mutation CreateNotes(
    $input: CreateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    createNotes(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateNotes = /* GraphQL */ `
  mutation UpdateNotes(
    $input: UpdateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    updateNotes(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteNotes = /* GraphQL */ `
  mutation DeleteNotes(
    $input: DeleteNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    deleteNotes(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createArtisanquote = /* GraphQL */ `
  mutation CreateArtisanquote(
    $input: CreateArtisanquoteInput!
    $condition: ModelArtisanquoteConditionInput
  ) {
    createArtisanquote(input: $input, condition: $condition) {
      id
      Amountquoted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateArtisanquote = /* GraphQL */ `
  mutation UpdateArtisanquote(
    $input: UpdateArtisanquoteInput!
    $condition: ModelArtisanquoteConditionInput
  ) {
    updateArtisanquote(input: $input, condition: $condition) {
      id
      Amountquoted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteArtisanquote = /* GraphQL */ `
  mutation DeleteArtisanquote(
    $input: DeleteArtisanquoteInput!
    $condition: ModelArtisanquoteConditionInput
  ) {
    deleteArtisanquote(input: $input, condition: $condition) {
      id
      Amountquoted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createContact = /* GraphQL */ `
  mutation CreateContact(
    $input: CreateContactInput!
    $condition: ModelContactConditionInput
  ) {
    createContact(input: $input, condition: $condition) {
      id
      artisanID
      Position
      Firstname
      Surname
      mobile
      isactive
      email
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateContact = /* GraphQL */ `
  mutation UpdateContact(
    $input: UpdateContactInput!
    $condition: ModelContactConditionInput
  ) {
    updateContact(input: $input, condition: $condition) {
      id
      artisanID
      Position
      Firstname
      Surname
      mobile
      isactive
      email
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteContact = /* GraphQL */ `
  mutation DeleteContact(
    $input: DeleteContactInput!
    $condition: ModelContactConditionInput
  ) {
    deleteContact(input: $input, condition: $condition) {
      id
      artisanID
      Position
      Firstname
      Surname
      mobile
      isactive
      email
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createArtisan = /* GraphQL */ `
  mutation CreateArtisan(
    $input: CreateArtisanInput!
    $condition: ModelArtisanConditionInput
  ) {
    createArtisan(input: $input, condition: $condition) {
      id
      Companyname
      Companyaddress
      Companypostcode
      isactive
      phone
      email
      interestedinMale
      interestedinfemale
      interestedinallgender
      interestedinrings
      interestedinnecklaces
      interestedinbraclets
      interestedinearrings
      interestedinchains
      interestedincufflinks
      interstedinaljewellrytypes
      agreedtoterms
      ipaddress
      Country
      Currency
      agreedtimestamp
      Contacts {
        items {
          id
          artisanID
          Position
          Firstname
          Surname
          mobile
          isactive
          email
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateArtisan = /* GraphQL */ `
  mutation UpdateArtisan(
    $input: UpdateArtisanInput!
    $condition: ModelArtisanConditionInput
  ) {
    updateArtisan(input: $input, condition: $condition) {
      id
      Companyname
      Companyaddress
      Companypostcode
      isactive
      phone
      email
      interestedinMale
      interestedinfemale
      interestedinallgender
      interestedinrings
      interestedinnecklaces
      interestedinbraclets
      interestedinearrings
      interestedinchains
      interestedincufflinks
      interstedinaljewellrytypes
      agreedtoterms
      ipaddress
      Country
      Currency
      agreedtimestamp
      Contacts {
        items {
          id
          artisanID
          Position
          Firstname
          Surname
          mobile
          isactive
          email
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteArtisan = /* GraphQL */ `
  mutation DeleteArtisan(
    $input: DeleteArtisanInput!
    $condition: ModelArtisanConditionInput
  ) {
    deleteArtisan(input: $input, condition: $condition) {
      id
      Companyname
      Companyaddress
      Companypostcode
      isactive
      phone
      email
      interestedinMale
      interestedinfemale
      interestedinallgender
      interestedinrings
      interestedinnecklaces
      interestedinbraclets
      interestedinearrings
      interestedinchains
      interestedincufflinks
      interstedinaljewellrytypes
      agreedtoterms
      ipaddress
      Country
      Currency
      agreedtimestamp
      Contacts {
        items {
          id
          artisanID
          Position
          Firstname
          Surname
          mobile
          isactive
          email
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCreations = /* GraphQL */ `
  mutation CreateCreations(
    $input: CreateCreationsInput!
    $condition: ModelCreationsConditionInput
  ) {
    createCreations(input: $input, condition: $condition) {
      id
      prompt
      costprompt
      gender
      jewellrytype
      material
      kwt
      stone
      grade
      Gemsource
      ringsize
      Style
      ringstyle
      gemsize
      cut
      url
      colour
      shape
      accepteddate
      ipaddress
      outstandingbalance
      requiredby
      Estimatecostfrom
      Estimatecostto
      lastupdate
      status
      submittedforquote
      submittedfororder
      termsaccepted
      amontquoted
      submitteddate
      clarity
      bandwidth
      Prompt_Strength
      Similarity_Strength
      seedurl
      Necklace_Length
      Bracelet_Length
      Secondary_Gemstone
      Earring_Fastening_Types
      Bracelet_Clasp_Types
      Ring_Band_Style
      Ring_Setting
      Necklace_Chain_Style
      Bracelet_Chain_Style
      Brooch_Fastening_Types
      Gem_Settings
      Necklace_Clasp
      clientID
      shared
      likes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCreations = /* GraphQL */ `
  mutation UpdateCreations(
    $input: UpdateCreationsInput!
    $condition: ModelCreationsConditionInput
  ) {
    updateCreations(input: $input, condition: $condition) {
      id
      prompt
      costprompt
      gender
      jewellrytype
      material
      kwt
      stone
      grade
      Gemsource
      ringsize
      Style
      ringstyle
      gemsize
      cut
      url
      colour
      shape
      accepteddate
      ipaddress
      outstandingbalance
      requiredby
      Estimatecostfrom
      Estimatecostto
      lastupdate
      status
      submittedforquote
      submittedfororder
      termsaccepted
      amontquoted
      submitteddate
      clarity
      bandwidth
      Prompt_Strength
      Similarity_Strength
      seedurl
      Necklace_Length
      Bracelet_Length
      Secondary_Gemstone
      Earring_Fastening_Types
      Bracelet_Clasp_Types
      Ring_Band_Style
      Ring_Setting
      Necklace_Chain_Style
      Bracelet_Chain_Style
      Brooch_Fastening_Types
      Gem_Settings
      Necklace_Clasp
      clientID
      shared
      likes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCreations = /* GraphQL */ `
  mutation DeleteCreations(
    $input: DeleteCreationsInput!
    $condition: ModelCreationsConditionInput
  ) {
    deleteCreations(input: $input, condition: $condition) {
      id
      prompt
      costprompt
      gender
      jewellrytype
      material
      kwt
      stone
      grade
      Gemsource
      ringsize
      Style
      ringstyle
      gemsize
      cut
      url
      colour
      shape
      accepteddate
      ipaddress
      outstandingbalance
      requiredby
      Estimatecostfrom
      Estimatecostto
      lastupdate
      status
      submittedforquote
      submittedfororder
      termsaccepted
      amontquoted
      submitteddate
      clarity
      bandwidth
      Prompt_Strength
      Similarity_Strength
      seedurl
      Necklace_Length
      Bracelet_Length
      Secondary_Gemstone
      Earring_Fastening_Types
      Bracelet_Clasp_Types
      Ring_Band_Style
      Ring_Setting
      Necklace_Chain_Style
      Bracelet_Chain_Style
      Brooch_Fastening_Types
      Gem_Settings
      Necklace_Clasp
      clientID
      shared
      likes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createClient = /* GraphQL */ `
  mutation CreateClient(
    $input: CreateClientInput!
    $condition: ModelClientConditionInput
  ) {
    createClient(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      mobile
      birthdate
      isactive
      Address1
      Address2
      City
      Postcode
      Housenumber
      updatedAt
      createdAt
      credits
      ipAddress
      Subscribed
      Role
      clientID {
        items {
          id
          prompt
          costprompt
          gender
          jewellrytype
          material
          kwt
          stone
          grade
          Gemsource
          ringsize
          Style
          ringstyle
          gemsize
          cut
          url
          colour
          shape
          accepteddate
          ipaddress
          outstandingbalance
          requiredby
          Estimatecostfrom
          Estimatecostto
          lastupdate
          status
          submittedforquote
          submittedfororder
          termsaccepted
          amontquoted
          submitteddate
          clarity
          bandwidth
          Prompt_Strength
          Similarity_Strength
          seedurl
          Necklace_Length
          Bracelet_Length
          Secondary_Gemstone
          Earring_Fastening_Types
          Bracelet_Clasp_Types
          Ring_Band_Style
          Ring_Setting
          Necklace_Chain_Style
          Bracelet_Chain_Style
          Brooch_Fastening_Types
          Gem_Settings
          Necklace_Clasp
          clientID
          shared
          likes
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      Country
      Currency
      IsArtisan
      Paywall
      __typename
    }
  }
`;
export const updateClient = /* GraphQL */ `
  mutation UpdateClient(
    $input: UpdateClientInput!
    $condition: ModelClientConditionInput
  ) {
    updateClient(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      mobile
      birthdate
      isactive
      Address1
      Address2
      City
      Postcode
      Housenumber
      updatedAt
      createdAt
      credits
      ipAddress
      Subscribed
      Role
      clientID {
        items {
          id
          prompt
          costprompt
          gender
          jewellrytype
          material
          kwt
          stone
          grade
          Gemsource
          ringsize
          Style
          ringstyle
          gemsize
          cut
          url
          colour
          shape
          accepteddate
          ipaddress
          outstandingbalance
          requiredby
          Estimatecostfrom
          Estimatecostto
          lastupdate
          status
          submittedforquote
          submittedfororder
          termsaccepted
          amontquoted
          submitteddate
          clarity
          bandwidth
          Prompt_Strength
          Similarity_Strength
          seedurl
          Necklace_Length
          Bracelet_Length
          Secondary_Gemstone
          Earring_Fastening_Types
          Bracelet_Clasp_Types
          Ring_Band_Style
          Ring_Setting
          Necklace_Chain_Style
          Bracelet_Chain_Style
          Brooch_Fastening_Types
          Gem_Settings
          Necklace_Clasp
          clientID
          shared
          likes
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      Country
      Currency
      IsArtisan
      Paywall
      __typename
    }
  }
`;
export const deleteClient = /* GraphQL */ `
  mutation DeleteClient(
    $input: DeleteClientInput!
    $condition: ModelClientConditionInput
  ) {
    deleteClient(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      mobile
      birthdate
      isactive
      Address1
      Address2
      City
      Postcode
      Housenumber
      updatedAt
      createdAt
      credits
      ipAddress
      Subscribed
      Role
      clientID {
        items {
          id
          prompt
          costprompt
          gender
          jewellrytype
          material
          kwt
          stone
          grade
          Gemsource
          ringsize
          Style
          ringstyle
          gemsize
          cut
          url
          colour
          shape
          accepteddate
          ipaddress
          outstandingbalance
          requiredby
          Estimatecostfrom
          Estimatecostto
          lastupdate
          status
          submittedforquote
          submittedfororder
          termsaccepted
          amontquoted
          submitteddate
          clarity
          bandwidth
          Prompt_Strength
          Similarity_Strength
          seedurl
          Necklace_Length
          Bracelet_Length
          Secondary_Gemstone
          Earring_Fastening_Types
          Bracelet_Clasp_Types
          Ring_Band_Style
          Ring_Setting
          Necklace_Chain_Style
          Bracelet_Chain_Style
          Brooch_Fastening_Types
          Gem_Settings
          Necklace_Clasp
          clientID
          shared
          likes
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      Country
      Currency
      IsArtisan
      Paywall
      __typename
    }
  }
`;
