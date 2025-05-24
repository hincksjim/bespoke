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
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { listBlogs, listComments } from "../graphql/queries";
import { createPost, updateComment } from "../graphql/mutations";
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
export default function PostCreateForm(props) {
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
    title: "",
    blog: undefined,
    comments: [],
  };
  const [title, setTitle] = React.useState(initialValues.title);
  const [blog, setBlog] = React.useState(initialValues.blog);
  const [blogLoading, setBlogLoading] = React.useState(false);
  const [blogRecords, setBlogRecords] = React.useState([]);
  const [comments, setComments] = React.useState(initialValues.comments);
  const [commentsLoading, setCommentsLoading] = React.useState(false);
  const [commentsRecords, setCommentsRecords] = React.useState([]);
  const autocompleteLength = 10;
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setTitle(initialValues.title);
    setBlog(initialValues.blog);
    setCurrentBlogValue(undefined);
    setCurrentBlogDisplayValue("");
    setComments(initialValues.comments);
    setCurrentCommentsValue(undefined);
    setCurrentCommentsDisplayValue("");
    setErrors({});
  };
  const [currentBlogDisplayValue, setCurrentBlogDisplayValue] =
    React.useState("");
  const [currentBlogValue, setCurrentBlogValue] = React.useState(undefined);
  const blogRef = React.createRef();
  const [currentCommentsDisplayValue, setCurrentCommentsDisplayValue] =
    React.useState("");
  const [currentCommentsValue, setCurrentCommentsValue] =
    React.useState(undefined);
  const commentsRef = React.createRef();
  const getIDValue = {
    blog: (r) => JSON.stringify({ id: r?.id }),
    comments: (r) => JSON.stringify({ id: r?.id }),
  };
  const blogIdSet = new Set(
    Array.isArray(blog)
      ? blog.map((r) => getIDValue.blog?.(r))
      : getIDValue.blog?.(blog)
  );
  const commentsIdSet = new Set(
    Array.isArray(comments)
      ? comments.map((r) => getIDValue.comments?.(r))
      : getIDValue.comments?.(comments)
  );
  const getDisplayValue = {
    blog: (r) => `${r?.name ? r?.name + " - " : ""}${r?.id}`,
    comments: (r) => `${r?.content ? r?.content + " - " : ""}${r?.id}`,
  };
  const validations = {
    title: [{ type: "Required" }],
    blog: [],
    comments: [],
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
  const fetchBlogRecords = async (value) => {
    setBlogLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [{ name: { contains: value } }, { id: { contains: value } }],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listBlogs.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listBlogs?.items;
      var loaded = result.filter(
        (item) => !blogIdSet.has(getIDValue.blog?.(item))
      );
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setBlogRecords(newOptions.slice(0, autocompleteLength));
    setBlogLoading(false);
  };
  const fetchCommentsRecords = async (value) => {
    setCommentsLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [{ content: { contains: value } }, { id: { contains: value } }],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listComments.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listComments?.items;
      var loaded = result.filter(
        (item) => !commentsIdSet.has(getIDValue.comments?.(item))
      );
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setCommentsRecords(newOptions.slice(0, autocompleteLength));
    setCommentsLoading(false);
  };
  React.useEffect(() => {
    fetchBlogRecords("");
    fetchCommentsRecords("");
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
          title,
          blog,
          comments,
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
            title: modelFields.title,
            blogPostsId: modelFields?.blog?.id,
          };
          const post = (
            await client.graphql({
              query: createPost.replaceAll("__typename", ""),
              variables: {
                input: {
                  ...modelFieldsToSave,
                },
              },
            })
          )?.data?.createPost;
          const promises = [];
          promises.push(
            ...comments.reduce((promises, original) => {
              promises.push(
                client.graphql({
                  query: updateComment.replaceAll("__typename", ""),
                  variables: {
                    input: {
                      id: original.id,
                      postCommentsId: post.id,
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
      {...getOverrideProps(overrides, "PostCreateForm")}
      {...rest}
    >
      <TextField
        label="Title"
        isRequired={true}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title: value,
              blog,
              comments,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <ArrayField
        lengthLimit={1}
        onChange={async (items) => {
          let value = items[0];
          if (onChange) {
            const modelFields = {
              title,
              blog: value,
              comments,
            };
            const result = onChange(modelFields);
            value = result?.blog ?? value;
          }
          setBlog(value);
          setCurrentBlogValue(undefined);
          setCurrentBlogDisplayValue("");
        }}
        currentFieldValue={currentBlogValue}
        label={"Blog"}
        items={blog ? [blog] : []}
        hasError={errors?.blog?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("blog", currentBlogValue)
        }
        errorMessage={errors?.blog?.errorMessage}
        getBadgeText={getDisplayValue.blog}
        setFieldValue={(model) => {
          setCurrentBlogDisplayValue(model ? getDisplayValue.blog(model) : "");
          setCurrentBlogValue(model);
        }}
        inputFieldRef={blogRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Blog"
          isRequired={false}
          isReadOnly={false}
          placeholder="Search Blog"
          value={currentBlogDisplayValue}
          options={blogRecords
            .filter((r) => !blogIdSet.has(getIDValue.blog?.(r)))
            .map((r) => ({
              id: getIDValue.blog?.(r),
              label: getDisplayValue.blog?.(r),
            }))}
          isLoading={blogLoading}
          onSelect={({ id, label }) => {
            setCurrentBlogValue(
              blogRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentBlogDisplayValue(label);
            runValidationTasks("blog", label);
          }}
          onClear={() => {
            setCurrentBlogDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            fetchBlogRecords(value);
            if (errors.blog?.hasError) {
              runValidationTasks("blog", value);
            }
            setCurrentBlogDisplayValue(value);
            setCurrentBlogValue(undefined);
          }}
          onBlur={() => runValidationTasks("blog", currentBlogDisplayValue)}
          errorMessage={errors.blog?.errorMessage}
          hasError={errors.blog?.hasError}
          ref={blogRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "blog")}
        ></Autocomplete>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              title,
              blog,
              comments: values,
            };
            const result = onChange(modelFields);
            values = result?.comments ?? values;
          }
          setComments(values);
          setCurrentCommentsValue(undefined);
          setCurrentCommentsDisplayValue("");
        }}
        currentFieldValue={currentCommentsValue}
        label={"Comments"}
        items={comments}
        hasError={errors?.comments?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("comments", currentCommentsValue)
        }
        errorMessage={errors?.comments?.errorMessage}
        getBadgeText={getDisplayValue.comments}
        setFieldValue={(model) => {
          setCurrentCommentsDisplayValue(
            model ? getDisplayValue.comments(model) : ""
          );
          setCurrentCommentsValue(model);
        }}
        inputFieldRef={commentsRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Comments"
          isRequired={false}
          isReadOnly={false}
          placeholder="Search Comment"
          value={currentCommentsDisplayValue}
          options={commentsRecords.map((r) => ({
            id: getIDValue.comments?.(r),
            label: getDisplayValue.comments?.(r),
          }))}
          isLoading={commentsLoading}
          onSelect={({ id, label }) => {
            setCurrentCommentsValue(
              commentsRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentCommentsDisplayValue(label);
            runValidationTasks("comments", label);
          }}
          onClear={() => {
            setCurrentCommentsDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            fetchCommentsRecords(value);
            if (errors.comments?.hasError) {
              runValidationTasks("comments", value);
            }
            setCurrentCommentsDisplayValue(value);
            setCurrentCommentsValue(undefined);
          }}
          onBlur={() =>
            runValidationTasks("comments", currentCommentsDisplayValue)
          }
          errorMessage={errors.comments?.errorMessage}
          hasError={errors.comments?.hasError}
          ref={commentsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "comments")}
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
