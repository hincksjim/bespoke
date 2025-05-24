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
import { listContacts } from "../graphql/queries";
import { createArtisan, updateContact } from "../graphql/mutations";
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
export default function ArtisanCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    Companyname: "",
    Companyaddress: "",
    Companypostcode: "",
    isactive: false,
    phone: "",
    email: "",
    interestedinMale: false,
    interestedinfemale: false,
    interestedinallgender: false,
    interestedinrings: false,
    interestedinnecklaces: false,
    interestedinbraclets: false,
    interestedinearrings: false,
    interestedinchains: false,
    interestedincufflinks: false,
    interstedinaljewellrytypes: false,
    agreedtoterms: false,
    ipaddress: "",
    Country: "",
    Currency: "",
    agreedtimestamp: "",
    Contacts: [],
  };
  const [Companyname, setCompanyname] = React.useState(
    initialValues.Companyname
  );
  const [Companyaddress, setCompanyaddress] = React.useState(
    initialValues.Companyaddress
  );
  const [Companypostcode, setCompanypostcode] = React.useState(
    initialValues.Companypostcode
  );
  const [isactive, setIsactive] = React.useState(initialValues.isactive);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [email, setEmail] = React.useState(initialValues.email);
  const [interestedinMale, setInterestedinMale] = React.useState(
    initialValues.interestedinMale
  );
  const [interestedinfemale, setInterestedinfemale] = React.useState(
    initialValues.interestedinfemale
  );
  const [interestedinallgender, setInterestedinallgender] = React.useState(
    initialValues.interestedinallgender
  );
  const [interestedinrings, setInterestedinrings] = React.useState(
    initialValues.interestedinrings
  );
  const [interestedinnecklaces, setInterestedinnecklaces] = React.useState(
    initialValues.interestedinnecklaces
  );
  const [interestedinbraclets, setInterestedinbraclets] = React.useState(
    initialValues.interestedinbraclets
  );
  const [interestedinearrings, setInterestedinearrings] = React.useState(
    initialValues.interestedinearrings
  );
  const [interestedinchains, setInterestedinchains] = React.useState(
    initialValues.interestedinchains
  );
  const [interestedincufflinks, setInterestedincufflinks] = React.useState(
    initialValues.interestedincufflinks
  );
  const [interstedinaljewellrytypes, setInterstedinaljewellrytypes] =
    React.useState(initialValues.interstedinaljewellrytypes);
  const [agreedtoterms, setAgreedtoterms] = React.useState(
    initialValues.agreedtoterms
  );
  const [ipaddress, setIpaddress] = React.useState(initialValues.ipaddress);
  const [Country, setCountry] = React.useState(initialValues.Country);
  const [Currency, setCurrency] = React.useState(initialValues.Currency);
  const [agreedtimestamp, setAgreedtimestamp] = React.useState(
    initialValues.agreedtimestamp
  );
  const [Contacts, setContacts] = React.useState(initialValues.Contacts);
  const [ContactsLoading, setContactsLoading] = React.useState(false);
  const [contactsRecords, setContactsRecords] = React.useState([]);
  const autocompleteLength = 10;
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setCompanyname(initialValues.Companyname);
    setCompanyaddress(initialValues.Companyaddress);
    setCompanypostcode(initialValues.Companypostcode);
    setIsactive(initialValues.isactive);
    setPhone(initialValues.phone);
    setEmail(initialValues.email);
    setInterestedinMale(initialValues.interestedinMale);
    setInterestedinfemale(initialValues.interestedinfemale);
    setInterestedinallgender(initialValues.interestedinallgender);
    setInterestedinrings(initialValues.interestedinrings);
    setInterestedinnecklaces(initialValues.interestedinnecklaces);
    setInterestedinbraclets(initialValues.interestedinbraclets);
    setInterestedinearrings(initialValues.interestedinearrings);
    setInterestedinchains(initialValues.interestedinchains);
    setInterestedincufflinks(initialValues.interestedincufflinks);
    setInterstedinaljewellrytypes(initialValues.interstedinaljewellrytypes);
    setAgreedtoterms(initialValues.agreedtoterms);
    setIpaddress(initialValues.ipaddress);
    setCountry(initialValues.Country);
    setCurrency(initialValues.Currency);
    setAgreedtimestamp(initialValues.agreedtimestamp);
    setContacts(initialValues.Contacts);
    setCurrentContactsValue(undefined);
    setCurrentContactsDisplayValue("");
    setErrors({});
  };
  const [currentContactsDisplayValue, setCurrentContactsDisplayValue] =
    React.useState("");
  const [currentContactsValue, setCurrentContactsValue] =
    React.useState(undefined);
  const ContactsRef = React.createRef();
  const getIDValue = {
    Contacts: (r) => JSON.stringify({ id: r?.id }),
  };
  const ContactsIdSet = new Set(
    Array.isArray(Contacts)
      ? Contacts.map((r) => getIDValue.Contacts?.(r))
      : getIDValue.Contacts?.(Contacts)
  );
  const getDisplayValue = {
    Contacts: (r) => `${r?.Position ? r?.Position + " - " : ""}${r?.id}`,
  };
  const validations = {
    Companyname: [],
    Companyaddress: [],
    Companypostcode: [],
    isactive: [],
    phone: [{ type: "Phone" }],
    email: [{ type: "Email" }],
    interestedinMale: [],
    interestedinfemale: [],
    interestedinallgender: [],
    interestedinrings: [],
    interestedinnecklaces: [],
    interestedinbraclets: [],
    interestedinearrings: [],
    interestedinchains: [],
    interestedincufflinks: [],
    interstedinaljewellrytypes: [],
    agreedtoterms: [],
    ipaddress: [{ type: "IpAddress" }],
    Country: [],
    Currency: [],
    agreedtimestamp: [],
    Contacts: [],
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
  const fetchContactsRecords = async (value) => {
    setContactsLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [{ Position: { contains: value } }, { id: { contains: value } }],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listContacts.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listContacts?.items;
      var loaded = result.filter(
        (item) => !ContactsIdSet.has(getIDValue.Contacts?.(item))
      );
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setContactsRecords(newOptions.slice(0, autocompleteLength));
    setContactsLoading(false);
  };
  React.useEffect(() => {
    fetchContactsRecords("");
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
          Companyname,
          Companyaddress,
          Companypostcode,
          isactive,
          phone,
          email,
          interestedinMale,
          interestedinfemale,
          interestedinallgender,
          interestedinrings,
          interestedinnecklaces,
          interestedinbraclets,
          interestedinearrings,
          interestedinchains,
          interestedincufflinks,
          interstedinaljewellrytypes,
          agreedtoterms,
          ipaddress,
          Country,
          Currency,
          agreedtimestamp,
          Contacts,
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
          const modelFieldsToSave = {
            Companyname: modelFields.Companyname,
            Companyaddress: modelFields.Companyaddress,
            Companypostcode: modelFields.Companypostcode,
            isactive: modelFields.isactive,
            phone: modelFields.phone,
            email: modelFields.email,
            interestedinMale: modelFields.interestedinMale,
            interestedinfemale: modelFields.interestedinfemale,
            interestedinallgender: modelFields.interestedinallgender,
            interestedinrings: modelFields.interestedinrings,
            interestedinnecklaces: modelFields.interestedinnecklaces,
            interestedinbraclets: modelFields.interestedinbraclets,
            interestedinearrings: modelFields.interestedinearrings,
            interestedinchains: modelFields.interestedinchains,
            interestedincufflinks: modelFields.interestedincufflinks,
            interstedinaljewellrytypes: modelFields.interstedinaljewellrytypes,
            agreedtoterms: modelFields.agreedtoterms,
            ipaddress: modelFields.ipaddress,
            Country: modelFields.Country,
            Currency: modelFields.Currency,
            agreedtimestamp: modelFields.agreedtimestamp,
          };
          const artisan = (
            await client.graphql({
              query: createArtisan.replaceAll("__typename", ""),
              variables: {
                input: {
                  ...modelFieldsToSave,
                },
              },
            })
          )?.data?.createArtisan;
          const promises = [];
          promises.push(
            ...Contacts.reduce((promises, original) => {
              promises.push(
                client.graphql({
                  query: updateContact.replaceAll("__typename", ""),
                  variables: {
                    input: {
                      id: original.id,
                      artisanID: artisan.id,
                    },
                  },
                })
              );
              return promises;
            }, [])
          );
          await Promise.all(promises);
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ArtisanCreateForm")}
      {...rest}
    >
      <TextField
        label="Companyname"
        isRequired={false}
        isReadOnly={false}
        value={Companyname}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Companyname: value,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.Companyname ?? value;
          }
          if (errors.Companyname?.hasError) {
            runValidationTasks("Companyname", value);
          }
          setCompanyname(value);
        }}
        onBlur={() => runValidationTasks("Companyname", Companyname)}
        errorMessage={errors.Companyname?.errorMessage}
        hasError={errors.Companyname?.hasError}
        {...getOverrideProps(overrides, "Companyname")}
      ></TextField>
      <TextField
        label="Companyaddress"
        isRequired={false}
        isReadOnly={false}
        value={Companyaddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress: value,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.Companyaddress ?? value;
          }
          if (errors.Companyaddress?.hasError) {
            runValidationTasks("Companyaddress", value);
          }
          setCompanyaddress(value);
        }}
        onBlur={() => runValidationTasks("Companyaddress", Companyaddress)}
        errorMessage={errors.Companyaddress?.errorMessage}
        hasError={errors.Companyaddress?.hasError}
        {...getOverrideProps(overrides, "Companyaddress")}
      ></TextField>
      <TextField
        label="Companypostcode"
        isRequired={false}
        isReadOnly={false}
        value={Companypostcode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode: value,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.Companypostcode ?? value;
          }
          if (errors.Companypostcode?.hasError) {
            runValidationTasks("Companypostcode", value);
          }
          setCompanypostcode(value);
        }}
        onBlur={() => runValidationTasks("Companypostcode", Companypostcode)}
        errorMessage={errors.Companypostcode?.errorMessage}
        hasError={errors.Companypostcode?.hasError}
        {...getOverrideProps(overrides, "Companypostcode")}
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
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive: value,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
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
        label="Phone"
        isRequired={false}
        isReadOnly={false}
        type="tel"
        value={phone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone: value,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.phone ?? value;
          }
          if (errors.phone?.hasError) {
            runValidationTasks("phone", value);
          }
          setPhone(value);
        }}
        onBlur={() => runValidationTasks("phone", phone)}
        errorMessage={errors.phone?.errorMessage}
        hasError={errors.phone?.hasError}
        {...getOverrideProps(overrides, "phone")}
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
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email: value,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
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
      <SwitchField
        label="Interestedin male"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interestedinMale}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale: value,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interestedinMale ?? value;
          }
          if (errors.interestedinMale?.hasError) {
            runValidationTasks("interestedinMale", value);
          }
          setInterestedinMale(value);
        }}
        onBlur={() => runValidationTasks("interestedinMale", interestedinMale)}
        errorMessage={errors.interestedinMale?.errorMessage}
        hasError={errors.interestedinMale?.hasError}
        {...getOverrideProps(overrides, "interestedinMale")}
      ></SwitchField>
      <SwitchField
        label="Interestedinfemale"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interestedinfemale}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale: value,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interestedinfemale ?? value;
          }
          if (errors.interestedinfemale?.hasError) {
            runValidationTasks("interestedinfemale", value);
          }
          setInterestedinfemale(value);
        }}
        onBlur={() =>
          runValidationTasks("interestedinfemale", interestedinfemale)
        }
        errorMessage={errors.interestedinfemale?.errorMessage}
        hasError={errors.interestedinfemale?.hasError}
        {...getOverrideProps(overrides, "interestedinfemale")}
      ></SwitchField>
      <SwitchField
        label="Interestedinallgender"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interestedinallgender}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender: value,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interestedinallgender ?? value;
          }
          if (errors.interestedinallgender?.hasError) {
            runValidationTasks("interestedinallgender", value);
          }
          setInterestedinallgender(value);
        }}
        onBlur={() =>
          runValidationTasks("interestedinallgender", interestedinallgender)
        }
        errorMessage={errors.interestedinallgender?.errorMessage}
        hasError={errors.interestedinallgender?.hasError}
        {...getOverrideProps(overrides, "interestedinallgender")}
      ></SwitchField>
      <SwitchField
        label="Interestedinrings"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interestedinrings}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings: value,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interestedinrings ?? value;
          }
          if (errors.interestedinrings?.hasError) {
            runValidationTasks("interestedinrings", value);
          }
          setInterestedinrings(value);
        }}
        onBlur={() =>
          runValidationTasks("interestedinrings", interestedinrings)
        }
        errorMessage={errors.interestedinrings?.errorMessage}
        hasError={errors.interestedinrings?.hasError}
        {...getOverrideProps(overrides, "interestedinrings")}
      ></SwitchField>
      <SwitchField
        label="Interestedinnecklaces"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interestedinnecklaces}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces: value,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interestedinnecklaces ?? value;
          }
          if (errors.interestedinnecklaces?.hasError) {
            runValidationTasks("interestedinnecklaces", value);
          }
          setInterestedinnecklaces(value);
        }}
        onBlur={() =>
          runValidationTasks("interestedinnecklaces", interestedinnecklaces)
        }
        errorMessage={errors.interestedinnecklaces?.errorMessage}
        hasError={errors.interestedinnecklaces?.hasError}
        {...getOverrideProps(overrides, "interestedinnecklaces")}
      ></SwitchField>
      <SwitchField
        label="Interestedinbraclets"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interestedinbraclets}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets: value,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interestedinbraclets ?? value;
          }
          if (errors.interestedinbraclets?.hasError) {
            runValidationTasks("interestedinbraclets", value);
          }
          setInterestedinbraclets(value);
        }}
        onBlur={() =>
          runValidationTasks("interestedinbraclets", interestedinbraclets)
        }
        errorMessage={errors.interestedinbraclets?.errorMessage}
        hasError={errors.interestedinbraclets?.hasError}
        {...getOverrideProps(overrides, "interestedinbraclets")}
      ></SwitchField>
      <SwitchField
        label="Interestedinearrings"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interestedinearrings}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings: value,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interestedinearrings ?? value;
          }
          if (errors.interestedinearrings?.hasError) {
            runValidationTasks("interestedinearrings", value);
          }
          setInterestedinearrings(value);
        }}
        onBlur={() =>
          runValidationTasks("interestedinearrings", interestedinearrings)
        }
        errorMessage={errors.interestedinearrings?.errorMessage}
        hasError={errors.interestedinearrings?.hasError}
        {...getOverrideProps(overrides, "interestedinearrings")}
      ></SwitchField>
      <SwitchField
        label="Interestedinchains"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interestedinchains}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains: value,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interestedinchains ?? value;
          }
          if (errors.interestedinchains?.hasError) {
            runValidationTasks("interestedinchains", value);
          }
          setInterestedinchains(value);
        }}
        onBlur={() =>
          runValidationTasks("interestedinchains", interestedinchains)
        }
        errorMessage={errors.interestedinchains?.errorMessage}
        hasError={errors.interestedinchains?.hasError}
        {...getOverrideProps(overrides, "interestedinchains")}
      ></SwitchField>
      <SwitchField
        label="Interestedincufflinks"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interestedincufflinks}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks: value,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interestedincufflinks ?? value;
          }
          if (errors.interestedincufflinks?.hasError) {
            runValidationTasks("interestedincufflinks", value);
          }
          setInterestedincufflinks(value);
        }}
        onBlur={() =>
          runValidationTasks("interestedincufflinks", interestedincufflinks)
        }
        errorMessage={errors.interestedincufflinks?.errorMessage}
        hasError={errors.interestedincufflinks?.hasError}
        {...getOverrideProps(overrides, "interestedincufflinks")}
      ></SwitchField>
      <SwitchField
        label="Interstedinaljewellrytypes"
        defaultChecked={false}
        isDisabled={false}
        isChecked={interstedinaljewellrytypes}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes: value,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.interstedinaljewellrytypes ?? value;
          }
          if (errors.interstedinaljewellrytypes?.hasError) {
            runValidationTasks("interstedinaljewellrytypes", value);
          }
          setInterstedinaljewellrytypes(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "interstedinaljewellrytypes",
            interstedinaljewellrytypes
          )
        }
        errorMessage={errors.interstedinaljewellrytypes?.errorMessage}
        hasError={errors.interstedinaljewellrytypes?.hasError}
        {...getOverrideProps(overrides, "interstedinaljewellrytypes")}
      ></SwitchField>
      <SwitchField
        label="Agreedtoterms"
        defaultChecked={false}
        isDisabled={false}
        isChecked={agreedtoterms}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms: value,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.agreedtoterms ?? value;
          }
          if (errors.agreedtoterms?.hasError) {
            runValidationTasks("agreedtoterms", value);
          }
          setAgreedtoterms(value);
        }}
        onBlur={() => runValidationTasks("agreedtoterms", agreedtoterms)}
        errorMessage={errors.agreedtoterms?.errorMessage}
        hasError={errors.agreedtoterms?.hasError}
        {...getOverrideProps(overrides, "agreedtoterms")}
      ></SwitchField>
      <TextField
        label="Ipaddress"
        isRequired={false}
        isReadOnly={false}
        value={ipaddress}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress: value,
              Country,
              Currency,
              agreedtimestamp,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.ipaddress ?? value;
          }
          if (errors.ipaddress?.hasError) {
            runValidationTasks("ipaddress", value);
          }
          setIpaddress(value);
        }}
        onBlur={() => runValidationTasks("ipaddress", ipaddress)}
        errorMessage={errors.ipaddress?.errorMessage}
        hasError={errors.ipaddress?.hasError}
        {...getOverrideProps(overrides, "ipaddress")}
      ></TextField>
      <TextField
        label="Country"
        isRequired={false}
        isReadOnly={false}
        value={Country}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country: value,
              Currency,
              agreedtimestamp,
              Contacts,
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
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency: value,
              agreedtimestamp,
              Contacts,
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
      <TextField
        label="Agreedtimestamp"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={agreedtimestamp && convertToLocal(new Date(agreedtimestamp))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp: value,
              Contacts,
            };
            const result = onChange(modelFields);
            value = result?.agreedtimestamp ?? value;
          }
          if (errors.agreedtimestamp?.hasError) {
            runValidationTasks("agreedtimestamp", value);
          }
          setAgreedtimestamp(value);
        }}
        onBlur={() => runValidationTasks("agreedtimestamp", agreedtimestamp)}
        errorMessage={errors.agreedtimestamp?.errorMessage}
        hasError={errors.agreedtimestamp?.hasError}
        {...getOverrideProps(overrides, "agreedtimestamp")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              Companyname,
              Companyaddress,
              Companypostcode,
              isactive,
              phone,
              email,
              interestedinMale,
              interestedinfemale,
              interestedinallgender,
              interestedinrings,
              interestedinnecklaces,
              interestedinbraclets,
              interestedinearrings,
              interestedinchains,
              interestedincufflinks,
              interstedinaljewellrytypes,
              agreedtoterms,
              ipaddress,
              Country,
              Currency,
              agreedtimestamp,
              Contacts: values,
            };
            const result = onChange(modelFields);
            values = result?.Contacts ?? values;
          }
          setContacts(values);
          setCurrentContactsValue(undefined);
          setCurrentContactsDisplayValue("");
        }}
        currentFieldValue={currentContactsValue}
        label={"Contacts"}
        items={Contacts}
        hasError={errors?.Contacts?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("Contacts", currentContactsValue)
        }
        errorMessage={errors?.Contacts?.errorMessage}
        getBadgeText={getDisplayValue.Contacts}
        setFieldValue={(model) => {
          setCurrentContactsDisplayValue(
            model ? getDisplayValue.Contacts(model) : ""
          );
          setCurrentContactsValue(model);
        }}
        inputFieldRef={ContactsRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Contacts"
          isRequired={false}
          isReadOnly={false}
          placeholder="Search Contact"
          value={currentContactsDisplayValue}
          options={contactsRecords
            .filter((r) => !ContactsIdSet.has(getIDValue.Contacts?.(r)))
            .map((r) => ({
              id: getIDValue.Contacts?.(r),
              label: getDisplayValue.Contacts?.(r),
            }))}
          isLoading={ContactsLoading}
          onSelect={({ id, label }) => {
            setCurrentContactsValue(
              contactsRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentContactsDisplayValue(label);
            runValidationTasks("Contacts", label);
          }}
          onClear={() => {
            setCurrentContactsDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            fetchContactsRecords(value);
            if (errors.Contacts?.hasError) {
              runValidationTasks("Contacts", value);
            }
            setCurrentContactsDisplayValue(value);
            setCurrentContactsValue(undefined);
          }}
          onBlur={() =>
            runValidationTasks("Contacts", currentContactsDisplayValue)
          }
          errorMessage={errors.Contacts?.errorMessage}
          hasError={errors.Contacts?.hasError}
          ref={ContactsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "Contacts")}
        ></Autocomplete>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
