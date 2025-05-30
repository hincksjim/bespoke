/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

// Complete aws-exports configuration with properly integrated secondary user pool
const awsmobile = {
  aws_project_region: "eu-west-2",
  aws_appsync_graphqlEndpoint: "https://2mg3qsmfazdqbfymmpe5cotxtm.appsync-api.eu-west-2.amazonaws.com/graphql",
  aws_appsync_region: "eu-west-2",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-n6vgcjxbanevnd7jyqcmf25grm",
  aws_cognito_identity_pool_id: "eu-west-2:3c4e666f-2dbb-4a94-bf17-bc9f092734c4",
  aws_cognito_region: "eu-west-2",
  aws_user_pools_id: "eu-west-2_QKp8bxrip",
  aws_user_pools_web_client_id: "gur8v7tkrg8j8g7pa2iiir0p8",
  oauth: {
    domain: "artisan.auth.eu-west-2.amazoncognito.com",
    scope: ["email", "openid", "phone"],
    redirectSignIn: "http://localhost:3000/auth/callback", // Customer callback
    redirectSignOut: "",
    responseType: "code",
  },
  aws_cognito_username_attributes: ["EMAIL"],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ["BIRTHDATE", "EMAIL", "FAMILY_NAME", "GIVEN_NAME", "PHONE_NUMBER"],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_mfa_types: ["SMS"],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ["EMAIL"],
  aws_user_files_s3_bucket: "elegencejewllery-storage-63fc7a6c0e9b8-devjewll",
  aws_user_files_s3_bucket_region: "eu-west-2",

  // Secondary User Pool Configuration (for artisan registration)
  secondaryUserPool: {
    userPoolId: "eu-west-2_Ob0nDl3b1",
    userPoolWebClientId: "6v86kmcrti94ha1g531j7f48rp",
    clientSecret: "1mdub2e2fdsvqjf85m4rca2gknvj1e8cdcn02aqm40sda4c0oejs", // Add your actual client secret here
    region: "eu-west-2",
    oauth: {
      domain: "eu-west-2ob0ndl3b1.auth.eu-west-2.amazoncognito.com",
      scope: ["email", "openid", "phone"],
      redirectSignIn: "http://localhost:3000/auth/artisan-callback",
      redirectSignOut: "",
      responseType: "code",
    },
  },
}

export default awsmobile

  