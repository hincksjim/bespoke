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
import { listArtisans } from "../graphql/queries";
import { createContact } from "../graphql/mutations";
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
export default function ContactCreateForm(props) {
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
    artisanID: undefined,
    Position: "",
    Firstname: "",
    Surname: "",
    mobile: "",
    isactive: false,
    email: "",
  };
  const [artisanID, setArtisanID] = React.useState(initialValues.artisanID);
  const [artisanIDLoading, setArtisanIDLoading] = React.useState(false);
  const [artisanIDRecords, setArtisanIDRecords] = React.useState([]);
  const [selectedArtisanIDRecords, setSelectedArtisanIDRecords] =
    React.useState([]);
  const [Position, setPosition] = React.useState(initialValues.Position);
  const [Firstname, setFirstname] = React.useState(initialValues.Firstname);
  const [Surname, setSurname] = React.useState(initialValues.Surname);
  const [mobile, setMobile] = React.useState(initialValues.mobile);
  const [isactive, setIsactive] = React.useState(initialValues.isactive);
  const [email, setEmail] = React.useState(initialValues.email);
  const autocompleteLength = 10;
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setArtisanID(initialValues.artisanID);
    setCurrentArtisanIDValue(undefined);
    setCurrentArtisanIDDisplayValue("");
    setPosition(initialValues.Position);
    setFirstname(initialValues.Firstname);
    setSurname(initialValues.Surname);
    setMobile(initialValues.mobile);
    setIsactive(initialValues.isactive);
    setEmail(initialValues.email);
    setErrors({});
  };
  const [currentArtisanIDDisplayValue, setCurrentArtisanIDDisplayValue] =
    React.useState("");
  const [currentArtisanIDValue, setCurrentArtisanIDValue] =
    React.useState(undefined);
  const artisanIDRef = React.createRef();
  const getDisplayValue = {
    artisanID: (r) => `${r?.Companyname ? r?.Companyname + " - " : ""}${r?.id}`,
  };
  const validations = {
    artisanID: [{ type: "Required" }],
    Position: [],
    Firstname: [],
    Surname: [],
    mobile: [{ type: "Phone" }],
    isactive: [],
    email: [{ type: "Email" }],
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
  const fetchArtisanIDRecords = async (value) => {
    setArtisanIDLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [
            { Companyname: { contains: value } },
            { id: { contains: value } },
          ],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listArtisans.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listArtisans?.items;
      var loaded = result.filter((item) => artisanID !== item.id);
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setArtisanIDRecords(newOptions.slice(0, autocompleteLength));
    setArtisanIDLoading(false);
  };
  React.useEffect(() => {
    fetchArtisanIDRecords("");
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
          artisanID,
          Position,
          Firstname,
          Surname,
          mobile,
          isactive,
          email,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
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
          await client.graphql({
            query: createContact.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
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
      {...getOverrideProps(overrides, "ContactCreateForm")}
      {...rest}
    >
      <ArrayField
        lengthLimit={1}
        onChange={async (items) => {
          let value = items[0];
          if (onChange) {
            const modelFields = {
              artisanID: value,
              Position,
              Firstname,
              Surname,
              mobile,
              isactive,
              email,
            };
            const result = onChange(modelFields);
            value = result?.artisanID ?? value;
          }
          setArtisanID(value);
          setCurrentArtisanIDValue(undefined);
        }}
        currentFieldValue={currentArtisanIDValue}
        label={"Artisan id"}
        items={artisanID ? [artisanID] : []}
        hasError={errors?.artisanID?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("artisanID", currentArtisanIDValue)
        }
        errorMessage={errors?.artisanID?.errorMessage}
        getBadgeText={(value) =>
          value
            ? getDisplayValue.artisanID(
                artisanIDRecords.find((r) => r.id === value) ??
                  selectedArtisanIDRecords.find((r) => r.id === value)
              )
            : ""
        }
        setFieldValue={(value) => {
          setCurrentArtisanIDDisplayValue(
            value
              ? getDisplayValue.artisanID(
                  artisanIDRecords.find((r) => r.id === value) ??
                    selectedArtisanIDRecords.find((r) => r.id === value)
                )
              : ""
          );
          setCurrentArtisanIDValue(value);
          const selectedRecord = artisanIDRecords.find((r) => r.id === value);
          if (selectedRecord) {
            setSelectedArtisanIDRecords([selectedRecord]);
          }
        }}
        inputFieldRef={artisanIDRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Artisan id"
          isRequired={true}
          isReadOnly={false}
          placeholder="Search Artisan"
          value={currentArtisanIDDisplayValue}
          options={artisanIDRecords
            .filter(
              (r, i, arr) =>
                arr.findIndex((member) => member?.id === r?.id) === i
            )
            .map((r) => ({
              id: r?.id,
              label: getDisplayValue.artisanID?.(r),
            }))}
          isLoading={artisanIDLoading}
          onSelect={({ id, label }) => {
            setCurrentArtisanIDValue(id);
            setCurrentArtisanIDDisplayValue(label);
            runValidationTasks("artisanID", label);
          }}
          onClear={() => {
            setCurrentArtisanIDDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            fetchArtisanIDRecords(value);
            if (errors.artisanID?.hasError) {
              runValidationTasks("artisanID", value);
            }
            setCurrentArtisanIDDisplayValue(value);
            setCurrentArtisanIDValue(undefined);
          }}
          onBlur={() => runValidationTasks("artisanID", currentArtisanIDValue)}
          errorMessage={errors.artisanID?.errorMessage}
          hasError={errors.artisanID?.hasError}
          ref={artisanIDRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "artisanID")}
        ></Autocomplete>
      </ArrayField>
      <TextField
        label="Position"
        isRequired={false}
        isReadOnly={false}
        value={Position}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              artisanID,
              Position: value,
              Firstname,
              Surname,
              mobile,
              isactive,
              email,
            };
            const result = onChange(modelFields);
            value = result?.Position ?? value;
          }
          if (errors.Position?.hasError) {
            runValidationTasks("Position", value);
          }
          setPosition(value);
        }}
        onBlur={() => runValidationTasks("Position", Position)}
        errorMessage={errors.Position?.errorMessage}
        hasError={errors.Position?.hasError}
        {...getOverrideProps(overrides, "Position")}
      ></TextField>
      <TextField
        label="Firstname"
        isRequired={false}
        isReadOnly={false}
        value={Firstname}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              artisanID,
              Position,
              Firstname: value,
              Surname,
              mobile,
              isactive,
              email,
            };
            const result = onChange(modelFields);
            value = result?.Firstname ?? value;
          }
          if (errors.Firstname?.hasError) {
            runValidationTasks("Firstname", value);
          }
          setFirstname(value);
        }}
        onBlur={() => runValidationTasks("Firstname", Firstname)}
        errorMessage={errors.Firstname?.errorMessage}
        hasError={errors.Firstname?.hasError}
        {...getOverrideProps(overrides, "Firstname")}
      ></TextField>
      <TextField
        label="Surname"
        isRequired={false}
        isReadOnly={false}
        value={Surname}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              artisanID,
              Position,
              Firstname,
              Surname: value,
              mobile,
              isactive,
              email,
            };
            const result = onChange(modelFields);
            value = result?.Surname ?? value;
          }
          if (errors.Surname?.hasError) {
            runValidationTasks("Surname", value);
          }
          setSurname(value);
        }}
        onBlur={() => runValidationTasks("Surname", Surname)}
        errorMessage={errors.Surname?.errorMessage}
        hasError={errors.Surname?.hasError}
        {...getOverrideProps(overrides, "Surname")}
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
              artisanID,
              Position,
              Firstname,
              Surname,
              mobile: value,
              isactive,
              email,
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
      <SwitchField
        label="Isactive"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isactive}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              artisanID,
              Position,
              Firstname,
              Surname,
              mobile,
              isactive: value,
              email,
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
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              artisanID,
              Position,
              Firstname,
              Surname,
              mobile,
              isactive,
              email: value,
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
