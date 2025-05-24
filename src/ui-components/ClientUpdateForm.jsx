/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Autocomplete,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SwitchField,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getClient, listCreations } from "../graphql/queries";
import { updateClient, updateCreations } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function ClientUpdateForm(props) {
  const {
    id: idProp,
    client: clientModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    birthdate: "",
    isactive: false,
    Address1: "",
    Address2: "",
    City: "",
    Postcode: "",
    Housenumber: "",
    updatedAt: "",
    createdAt: "",
    credits: "",
    ipAddress: "",
    Subscribed: false,
    Role: "",
    clientID: [],
    Country: "",
    Currency: "",
    IsArtisan: false,
    Paywall: "",
  };
  const [firstName, setFirstName] = React.useState(initialValues.firstName);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [email, setEmail] = React.useState(initialValues.email);
  const [mobile, setMobile] = React.useState(initialValues.mobile);
  const [birthdate, setBirthdate] = React.useState(initialValues.birthdate);
  const [isactive, setIsactive] = React.useState(initialValues.isactive);
  const [Address1, setAddress1] = React.useState(initialValues.Address1);
  const [Address2, setAddress2] = React.useState(initialValues.Address2);
  const [City, setCity] = React.useState(initialValues.City);
  const [Postcode, setPostcode] = React.useState(initialValues.Postcode);
  const [Housenumber, setHousenumber] = React.useState(
    initialValues.Housenumber
  );
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [credits, setCredits] = React.useState(initialValues.credits);
  const [ipAddress, setIpAddress] = React.useState(initialValues.ipAddress);
  const [Subscribed, setSubscribed] = React.useState(initialValues.Subscribed);
  const [Role, setRole] = React.useState(initialValues.Role);
  const [clientID, setClientID] = React.useState(initialValues.clientID);
  const [clientIDLoading, setClientIDLoading] = React.useState(false);
  const [clientIDRecords, setClientIDRecords] = React.useState([]);
  const [Country, setCountry] = React.useState(initialValues.Country);
  const [Currency, setCurrency] = React.useState(initialValues.Currency);
  const [IsArtisan, setIsArtisan] = React.useState(initialValues.IsArtisan);
  const [Paywall, setPaywall] = React.useState(initialValues.Paywall);
  const autocompleteLength = 10;
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = clientRecord
      ? { ...initialValues, ...clientRecord, clientID: linkedClientID }
      : initialValues;
    setFirstName(cleanValues.firstName);
    setLastName(cleanValues.lastName);
    setEmail(cleanValues.email);
    setMobile(cleanValues.mobile);
    setBirthdate(cleanValues.birthdate);
    setIsactive(cleanValues.isactive);
    setAddress1(cleanValues.Address1);
    setAddress2(cleanValues.Address2);
    setCity(cleanValues.City);
    setPostcode(cleanValues.Postcode);
    setHousenumber(cleanValues.Housenumber);
    setUpdatedAt(cleanValues.updatedAt);
    setCreatedAt(cleanValues.createdAt);
    setCredits(cleanValues.credits);
    setIpAddress(cleanValues.ipAddress);
    setSubscribed(cleanValues.Subscribed);
    setRole(cleanValues.Role);
    setClientID(cleanValues.clientID ?? []);
    setCurrentClientIDValue(undefined);
    setCurrentClientIDDisplayValue("");
    setCountry(cleanValues.Country);
    setCurrency(cleanValues.Currency);
    setIsArtisan(cleanValues.IsArtisan);
    setPaywall(cleanValues.Paywall);
    setErrors({});
  };
  const [clientRecord, setClientRecord] = React.useState(clientModelProp);
  const [linkedClientID, setLinkedClientID] = React.useState([]);
  const canUnlinkClientID = false;
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getClient.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getClient
        : clientModelProp;
      const linkedClientID = record?.clientID?.items ?? [];
      setLinkedClientID(linkedClientID);
      setClientRecord(record);
    };
    queryData();
  }, [idProp, clientModelProp]);
  React.useEffect(resetStateValues, [clientRecord, linkedClientID]);
  const [currentClientIDDisplayValue, setCurrentClientIDDisplayValue] =
    React.useState("");
  const [currentClientIDValue, setCurrentClientIDValue] =
    React.useState(undefined);
  const clientIDRef = React.createRef();
  const getIDValue = {
    clientID: (r) => JSON.stringify({ id: r?.id }),
  };
  const clientIDIdSet = new Set(
    Array.isArray(clientID)
      ? clientID.map((r) => getIDValue.clientID?.(r))
      : getIDValue.clientID?.(clientID)
  );
  const getDisplayValue = {
    clientID: (r) => `${r?.prompt ? r?.prompt + " - " : ""}${r?.id}`,
  };
  const validations = {
    firstName: [],
    lastName: [],
    email: [{ type: "Email" }],
    mobile: [{ type: "Phone" }],
    birthdate: [],
    isactive: [],
    Address1: [],
    Address2: [],
    City: [],
    Postcode: [],
    Housenumber: [],
    updatedAt: [],
    createdAt: [],
    credits: [],
    ipAddress: [{ type: "IpAddress" }],
    Subscribed: [],
    Role: [],
    clientID: [],
    Country: [],
    Currency: [],
    IsArtisan: [],
    Paywall: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  const fetchClientIDRecords = async (value) => {
    setClientIDLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [{ prompt: { contains: value } }, { id: { contains: value } }],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listCreations.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listCreations?.items;
      var loaded = result.filter(
        (item) => !clientIDIdSet.has(getIDValue.clientID?.(item))
      );
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setClientIDRecords(newOptions.slice(0, autocompleteLength));
    setClientIDLoading(false);
  };
  React.useEffect(() => {
    fetchClientIDRecords("");
  }, []);
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          firstName: firstName ?? null,
          lastName: lastName ?? null,
          email: email ?? null,
          mobile: mobile ?? null,
          birthdate: birthdate ?? null,
          isactive: isactive ?? null,
          Address1: Address1 ?? null,
          Address2: Address2 ?? null,
          City: City ?? null,
          Postcode: Postcode ?? null,
          Housenumber: Housenumber ?? null,
          updatedAt: updatedAt ?? null,
          createdAt: createdAt ?? null,
          credits: credits ?? null,
          ipAddress: ipAddress ?? null,
          Subscribed: Subscribed ?? null,
          Role: Role ?? null,
          clientID: clientID ?? null,
          Country: Country ?? null,
          Currency: Currency ?? null,
          IsArtisan: IsArtisan ?? null,
          Paywall: Paywall ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(
                    fieldName,
                    item,
                    getDisplayValue[fieldName]
                  )
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(
                fieldName,
                modelFields[fieldName],
                getDisplayValue[fieldName]
              )
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          const promises = [];
          const clientIDToLink = [];
          const clientIDToUnLink = [];
          const clientIDSet = new Set();
          const linkedClientIDSet = new Set();
          clientID.forEach((r) => clientIDSet.add(getIDValue.clientID?.(r)));
          linkedClientID.forEach((r) =>
            linkedClientIDSet.add(getIDValue.clientID?.(r))
          );
          linkedClientID.forEach((r) => {
            if (!clientIDSet.has(getIDValue.clientID?.(r))) {
              clientIDToUnLink.push(r);
            }
          });
          clientID.forEach((r) => {
            if (!linkedClientIDSet.has(getIDValue.clientID?.(r))) {
              clientIDToLink.push(r);
            }
          });
          clientIDToUnLink.forEach((original) => {
            if (!canUnlinkClientID) {
              throw Error(
                `Creations ${original.id} cannot be unlinked from Client because clientID is a required field.`
              );
            }
            promises.push(
              client.graphql({
                query: updateCreations.replaceAll("__typename", ""),
                variables: {
                  input: {
                    id: original.id,
                    clientID: null,
                  },
                },
              })
            );
          });
          clientIDToLink.forEach((original) => {
            promises.push(
              client.graphql({
                query: updateCreations.replaceAll("__typename", ""),
                variables: {
                  input: {
                    id: original.id,
                    clientID: clientRecord.id,
                  },
                },
              })
            );
          });
          const modelFieldsToSave = {
            firstName: modelFields.firstName ?? null,
            lastName: modelFields.lastName ?? null,
            email: modelFields.email ?? null,
            mobile: modelFields.mobile ?? null,
            birthdate: modelFields.birthdate ?? null,
            isactive: modelFields.isactive ?? null,
            Address1: modelFields.Address1 ?? null,
            Address2: modelFields.Address2 ?? null,
            City: modelFields.City ?? null,
            Postcode: modelFields.Postcode ?? null,
            Housenumber: modelFields.Housenumber ?? null,
            updatedAt: modelFields.updatedAt ?? null,
            createdAt: modelFields.createdAt ?? null,
            credits: modelFields.credits ?? null,
            ipAddress: modelFields.ipAddress ?? null,
            Subscribed: modelFields.Subscribed ?? null,
            Role: modelFields.Role ?? null,
            Country: modelFields.Country ?? null,
            Currency: modelFields.Currency ?? null,
            IsArtisan: modelFields.IsArtisan ?? null,
            Paywall: modelFields.Paywall ?? null,
          };
          promises.push(
            client.graphql({
              query: updateClient.replaceAll("__typename", ""),
              variables: {
                input: {
                  id: clientRecord.id,
                  ...modelFieldsToSave,
                },
              },
            })
          );
          await Promise.all(promises);
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ClientUpdateForm")}
      {...rest}
    >
      <TextField
        label="First name"
        isRequired={false}
        isReadOnly={false}
        value={firstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName: value,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.firstName ?? value;
          }
          if (errors.firstName?.hasError) {
            runValidationTasks("firstName", value);
          }
          setFirstName(value);
        }}
        onBlur={() => runValidationTasks("firstName", firstName)}
        errorMessage={errors.firstName?.errorMessage}
        hasError={errors.firstName?.hasError}
        {...getOverrideProps(overrides, "firstName")}
      ></TextField>
      <TextField
        label="Last name"
        isRequired={false}
        isReadOnly={false}
        value={lastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName: value,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.lastName ?? value;
          }
          if (errors.lastName?.hasError) {
            runValidationTasks("lastName", value);
          }
          setLastName(value);
        }}
        onBlur={() => runValidationTasks("lastName", lastName)}
        errorMessage={errors.lastName?.errorMessage}
        hasError={errors.lastName?.hasError}
        {...getOverrideProps(overrides, "lastName")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email: value,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Mobile"
        isRequired={false}
        isReadOnly={false}
        type="tel"
        value={mobile}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile: value,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.mobile ?? value;
          }
          if (errors.mobile?.hasError) {
            runValidationTasks("mobile", value);
          }
          setMobile(value);
        }}
        onBlur={() => runValidationTasks("mobile", mobile)}
        errorMessage={errors.mobile?.errorMessage}
        hasError={errors.mobile?.hasError}
        {...getOverrideProps(overrides, "mobile")}
      ></TextField>
      <TextField
        label="Birthdate"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={birthdate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate: value,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.birthdate ?? value;
          }
          if (errors.birthdate?.hasError) {
            runValidationTasks("birthdate", value);
          }
          setBirthdate(value);
        }}
        onBlur={() => runValidationTasks("birthdate", birthdate)}
        errorMessage={errors.birthdate?.errorMessage}
        hasError={errors.birthdate?.hasError}
        {...getOverrideProps(overrides, "birthdate")}
      ></TextField>
      <SwitchField
        label="Isactive"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isactive}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive: value,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.isactive ?? value;
          }
          if (errors.isactive?.hasError) {
            runValidationTasks("isactive", value);
          }
          setIsactive(value);
        }}
        onBlur={() => runValidationTasks("isactive", isactive)}
        errorMessage={errors.isactive?.errorMessage}
        hasError={errors.isactive?.hasError}
        {...getOverrideProps(overrides, "isactive")}
      ></SwitchField>
      <TextField
        label="Address1"
        isRequired={false}
        isReadOnly={false}
        value={Address1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1: value,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.Address1 ?? value;
          }
          if (errors.Address1?.hasError) {
            runValidationTasks("Address1", value);
          }
          setAddress1(value);
        }}
        onBlur={() => runValidationTasks("Address1", Address1)}
        errorMessage={errors.Address1?.errorMessage}
        hasError={errors.Address1?.hasError}
        {...getOverrideProps(overrides, "Address1")}
      ></TextField>
      <TextField
        label="Address2"
        isRequired={false}
        isReadOnly={false}
        value={Address2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2: value,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.Address2 ?? value;
          }
          if (errors.Address2?.hasError) {
            runValidationTasks("Address2", value);
          }
          setAddress2(value);
        }}
        onBlur={() => runValidationTasks("Address2", Address2)}
        errorMessage={errors.Address2?.errorMessage}
        hasError={errors.Address2?.hasError}
        {...getOverrideProps(overrides, "Address2")}
      ></TextField>
      <TextField
        label="City"
        isRequired={false}
        isReadOnly={false}
        value={City}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City: value,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.City ?? value;
          }
          if (errors.City?.hasError) {
            runValidationTasks("City", value);
          }
          setCity(value);
        }}
        onBlur={() => runValidationTasks("City", City)}
        errorMessage={errors.City?.errorMessage}
        hasError={errors.City?.hasError}
        {...getOverrideProps(overrides, "City")}
      ></TextField>
      <TextField
        label="Postcode"
        isRequired={false}
        isReadOnly={false}
        value={Postcode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode: value,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.Postcode ?? value;
          }
          if (errors.Postcode?.hasError) {
            runValidationTasks("Postcode", value);
          }
          setPostcode(value);
        }}
        onBlur={() => runValidationTasks("Postcode", Postcode)}
        errorMessage={errors.Postcode?.errorMessage}
        hasError={errors.Postcode?.hasError}
        {...getOverrideProps(overrides, "Postcode")}
      ></TextField>
      <TextField
        label="Housenumber"
        isRequired={false}
        isReadOnly={false}
        value={Housenumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber: value,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.Housenumber ?? value;
          }
          if (errors.Housenumber?.hasError) {
            runValidationTasks("Housenumber", value);
          }
          setHousenumber(value);
        }}
        onBlur={() => runValidationTasks("Housenumber", Housenumber)}
        errorMessage={errors.Housenumber?.errorMessage}
        hasError={errors.Housenumber?.hasError}
        {...getOverrideProps(overrides, "Housenumber")}
      ></TextField>
      <TextField
        label="Updated at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={updatedAt && convertToLocal(new Date(updatedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt: value,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt: value,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <TextField
        label="Credits"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={credits}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits: value,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.credits ?? value;
          }
          if (errors.credits?.hasError) {
            runValidationTasks("credits", value);
          }
          setCredits(value);
        }}
        onBlur={() => runValidationTasks("credits", credits)}
        errorMessage={errors.credits?.errorMessage}
        hasError={errors.credits?.hasError}
        {...getOverrideProps(overrides, "credits")}
      ></TextField>
      <TextField
        label="Ip address"
        isRequired={false}
        isReadOnly={false}
        value={ipAddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress: value,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.ipAddress ?? value;
          }
          if (errors.ipAddress?.hasError) {
            runValidationTasks("ipAddress", value);
          }
          setIpAddress(value);
        }}
        onBlur={() => runValidationTasks("ipAddress", ipAddress)}
        errorMessage={errors.ipAddress?.errorMessage}
        hasError={errors.ipAddress?.hasError}
        {...getOverrideProps(overrides, "ipAddress")}
      ></TextField>
      <SwitchField
        label="Subscribed"
        defaultChecked={false}
        isDisabled={false}
        isChecked={Subscribed}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed: value,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.Subscribed ?? value;
          }
          if (errors.Subscribed?.hasError) {
            runValidationTasks("Subscribed", value);
          }
          setSubscribed(value);
        }}
        onBlur={() => runValidationTasks("Subscribed", Subscribed)}
        errorMessage={errors.Subscribed?.errorMessage}
        hasError={errors.Subscribed?.hasError}
        {...getOverrideProps(overrides, "Subscribed")}
      ></SwitchField>
      <TextField
        label="Role"
        isRequired={false}
        isReadOnly={false}
        value={Role}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role: value,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.Role ?? value;
          }
          if (errors.Role?.hasError) {
            runValidationTasks("Role", value);
          }
          setRole(value);
        }}
        onBlur={() => runValidationTasks("Role", Role)}
        errorMessage={errors.Role?.errorMessage}
        hasError={errors.Role?.hasError}
        {...getOverrideProps(overrides, "Role")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID: values,
              Country,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            values = result?.clientID ?? values;
          }
          setClientID(values);
          setCurrentClientIDValue(undefined);
          setCurrentClientIDDisplayValue("");
        }}
        currentFieldValue={currentClientIDValue}
        label={"Client id"}
        items={clientID}
        hasError={errors?.clientID?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("clientID", currentClientIDValue)
        }
        errorMessage={errors?.clientID?.errorMessage}
        getBadgeText={getDisplayValue.clientID}
        setFieldValue={(model) => {
          setCurrentClientIDDisplayValue(
            model ? getDisplayValue.clientID(model) : ""
          );
          setCurrentClientIDValue(model);
        }}
        inputFieldRef={clientIDRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Client id"
          isRequired={false}
          isReadOnly={false}
          placeholder="Search Creations"
          value={currentClientIDDisplayValue}
          options={clientIDRecords
            .filter((r) => !clientIDIdSet.has(getIDValue.clientID?.(r)))
            .map((r) => ({
              id: getIDValue.clientID?.(r),
              label: getDisplayValue.clientID?.(r),
            }))}
          isLoading={clientIDLoading}
          onSelect={({ id, label }) => {
            setCurrentClientIDValue(
              clientIDRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentClientIDDisplayValue(label);
            runValidationTasks("clientID", label);
          }}
          onClear={() => {
            setCurrentClientIDDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            fetchClientIDRecords(value);
            if (errors.clientID?.hasError) {
              runValidationTasks("clientID", value);
            }
            setCurrentClientIDDisplayValue(value);
            setCurrentClientIDValue(undefined);
          }}
          onBlur={() =>
            runValidationTasks("clientID", currentClientIDDisplayValue)
          }
          errorMessage={errors.clientID?.errorMessage}
          hasError={errors.clientID?.hasError}
          ref={clientIDRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "clientID")}
        ></Autocomplete>
      </ArrayField>
      <TextField
        label="Country"
        isRequired={false}
        isReadOnly={false}
        value={Country}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country: value,
              Currency,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.Country ?? value;
          }
          if (errors.Country?.hasError) {
            runValidationTasks("Country", value);
          }
          setCountry(value);
        }}
        onBlur={() => runValidationTasks("Country", Country)}
        errorMessage={errors.Country?.errorMessage}
        hasError={errors.Country?.hasError}
        {...getOverrideProps(overrides, "Country")}
      ></TextField>
      <TextField
        label="Currency"
        isRequired={false}
        isReadOnly={false}
        value={Currency}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency: value,
              IsArtisan,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.Currency ?? value;
          }
          if (errors.Currency?.hasError) {
            runValidationTasks("Currency", value);
          }
          setCurrency(value);
        }}
        onBlur={() => runValidationTasks("Currency", Currency)}
        errorMessage={errors.Currency?.errorMessage}
        hasError={errors.Currency?.hasError}
        {...getOverrideProps(overrides, "Currency")}
      ></TextField>
      <SwitchField
        label="Is artisan"
        defaultChecked={false}
        isDisabled={false}
        isChecked={IsArtisan}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan: value,
              Paywall,
            };
            const result = onChange(modelFields);
            value = result?.IsArtisan ?? value;
          }
          if (errors.IsArtisan?.hasError) {
            runValidationTasks("IsArtisan", value);
          }
          setIsArtisan(value);
        }}
        onBlur={() => runValidationTasks("IsArtisan", IsArtisan)}
        errorMessage={errors.IsArtisan?.errorMessage}
        hasError={errors.IsArtisan?.hasError}
        {...getOverrideProps(overrides, "IsArtisan")}
      ></SwitchField>
      <TextField
        label="Paywall"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={Paywall}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              firstName,
              lastName,
              email,
              mobile,
              birthdate,
              isactive,
              Address1,
              Address2,
              City,
              Postcode,
              Housenumber,
              updatedAt,
              createdAt,
              credits,
              ipAddress,
              Subscribed,
              Role,
              clientID,
              Country,
              Currency,
              IsArtisan,
              Paywall: value,
            };
            const result = onChange(modelFields);
            value = result?.Paywall ?? value;
          }
          if (errors.Paywall?.hasError) {
            runValidationTasks("Paywall", value);
          }
          setPaywall(value);
        }}
        onBlur={() => runValidationTasks("Paywall", Paywall)}
        errorMessage={errors.Paywall?.errorMessage}
        hasError={errors.Paywall?.hasError}
        {...getOverrideProps(overrides, "Paywall")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || clientModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || clientModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
