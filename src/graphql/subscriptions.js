/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePayment = /* GraphQL */ `
  subscription OnCreatePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onCreatePayment(filter: $filter) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePayment = /* GraphQL */ `
  subscription OnUpdatePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onUpdatePayment(filter: $filter) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeletePayment = /* GraphQL */ `
  subscription OnDeletePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onDeletePayment(filter: $filter) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateNotes = /* GraphQL */ `
  subscription OnCreateNotes($filter: ModelSubscriptionNotesFilterInput) {
    onCreateNotes(filter: $filter) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateNotes = /* GraphQL */ `
  subscription OnUpdateNotes($filter: ModelSubscriptionNotesFilterInput) {
    onUpdateNotes(filter: $filter) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteNotes = /* GraphQL */ `
  subscription OnDeleteNotes($filter: ModelSubscriptionNotesFilterInput) {
    onDeleteNotes(filter: $filter) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateArtisanquote = /* GraphQL */ `
  subscription OnCreateArtisanquote(
    $filter: ModelSubscriptionArtisanquoteFilterInput
  ) {
    onCreateArtisanquote(filter: $filter) {
      id
      Amountquoted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateArtisanquote = /* GraphQL */ `
  subscription OnUpdateArtisanquote(
    $filter: ModelSubscriptionArtisanquoteFilterInput
  ) {
    onUpdateArtisanquote(filter: $filter) {
      id
      Amountquoted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteArtisanquote = /* GraphQL */ `
  subscription OnDeleteArtisanquote(
    $filter: ModelSubscriptionArtisanquoteFilterInput
  ) {
    onDeleteArtisanquote(filter: $filter) {
      id
      Amountquoted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateContact = /* GraphQL */ `
  subscription OnCreateContact($filter: ModelSubscriptionContactFilterInput) {
    onCreateContact(filter: $filter) {
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
export const onUpdateContact = /* GraphQL */ `
  subscription OnUpdateContact($filter: ModelSubscriptionContactFilterInput) {
    onUpdateContact(filter: $filter) {
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
export const onDeleteContact = /* GraphQL */ `
  subscription OnDeleteContact($filter: ModelSubscriptionContactFilterInput) {
    onDeleteContact(filter: $filter) {
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
export const onCreateArtisan = /* GraphQL */ `
  subscription OnCreateArtisan($filter: ModelSubscriptionArtisanFilterInput) {
    onCreateArtisan(filter: $filter) {
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
export const onUpdateArtisan = /* GraphQL */ `
  subscription OnUpdateArtisan($filter: ModelSubscriptionArtisanFilterInput) {
    onUpdateArtisan(filter: $filter) {
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
export const onDeleteArtisan = /* GraphQL */ `
  subscription OnDeleteArtisan($filter: ModelSubscriptionArtisanFilterInput) {
    onDeleteArtisan(filter: $filter) {
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
export const onCreateCreations = /* GraphQL */ `
  subscription OnCreateCreations(
    $filter: ModelSubscriptionCreationsFilterInput
  ) {
    onCreateCreations(filter: $filter) {
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
export const onUpdateCreations = /* GraphQL */ `
  subscription OnUpdateCreations(
    $filter: ModelSubscriptionCreationsFilterInput
  ) {
    onUpdateCreations(filter: $filter) {
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
export const onDeleteCreations = /* GraphQL */ `
  subscription OnDeleteCreations(
    $filter: ModelSubscriptionCreationsFilterInput
  ) {
    onDeleteCreations(filter: $filter) {
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
export const onCreateClient = /* GraphQL */ `
  subscription OnCreateClient($filter: ModelSubscriptionClientFilterInput) {
    onCreateClient(filter: $filter) {
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
export const onUpdateClient = /* GraphQL */ `
  subscription OnUpdateClient($filter: ModelSubscriptionClientFilterInput) {
    onUpdateClient(filter: $filter) {
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
export const onDeleteClient = /* GraphQL */ `
  subscription OnDeleteClient($filter: ModelSubscriptionClientFilterInput) {
    onDeleteClient(filter: $filter) {
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
