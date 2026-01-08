import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  theme,
  Button,
  InputField,
  Label,
  css,
} from "@webstudio-is/design-system";
import { PluginIcon, TrashIcon, CheckMarkIcon, AlertIcon } from "@webstudio-is/icons";
import { useFetcher } from "@remix-run/react";

export const ResourcesPage = () => {
  const fetcher = useFetcher();
  
  // State for resources
  const [resources, setResources] = useState<
    Array<{ id: string; name: string; url: string; data?: unknown; error?: string }>
  >([]);
  
  // State to track if we have loaded from storage (prevents overwriting storage on initial load)
  const [isLoaded, setIsLoaded] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", url: "" });

  const isLoading = fetcher.state === "submitting";

  // 1. LOAD FROM LOCAL STORAGE ON MOUNT
  useEffect(() => {
    const saved = localStorage.getItem("autobuilder_resources");
    if (saved) {
      try {
        setResources(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved resources", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. SAVE TO LOCAL STORAGE WHENEVER RESOURCES CHANGE
  useEffect(() => {
    // Only save if we have finished the initial load
    if (isLoaded) {
      localStorage.setItem("autobuilder_resources", JSON.stringify(resources));
    }
  }, [resources, isLoaded]);

  const handleAddResource = () => {
    if (!formData.name || !formData.url) {
      alert("Please fill in all fields");
      return;
    }

    fetcher.submit(
      { url: formData.url },
      { method: "post", action: "/api/test-resource" }
    );
  };

  const handleRefreshResource = (resource: { url: string }) => {
    fetcher.submit(
      { url: resource.url },
      { method: "post", action: "/api/test-resource" }
    );
  };

  // Handle fetcher data updates (Add or Refresh)
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const submittedUrl = fetcher.formData?.get("url") as string;
      const targetUrl = submittedUrl || formData.url;

      if (!targetUrl) return;

      setResources((prevResources) => {
        const existingIndex = prevResources.findIndex((r) => r.url === targetUrl);
        const responseData = fetcher.data.success ? fetcher.data.data : undefined;
        const responseError = fetcher.data.error;

        if (existingIndex >= 0) {
          // UPDATE existing
          const updatedResources = [...prevResources];
          updatedResources[existingIndex] = {
            ...updatedResources[existingIndex],
            data: responseData,
            error: responseError,
          };
          return updatedResources;
        } else {
          // CREATE new
          if (formData.name) {
             const newResource = {
              id: Date.now().toString(),
              name: formData.name,
              url: targetUrl,
              data: responseData,
              error: responseError,
            };
            setFormData({ name: "", url: "" });
            setShowForm(false);
            return [...prevResources, newResource];
          }
          return prevResources;
        }
      });
    }
  }, [fetcher.state, fetcher.data, formData.name, formData.url]);

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  // --- STYLES ---
  const containerStyle = css({
    padding: theme.spacing[8],
    maxWidth: "900px",
    margin: "0 auto",
    width: "100%",
  });

  const headerStyle = css({
    marginBottom: theme.spacing[8],
    borderBottom: `1px solid ${theme.colors.borderMain}`,
    paddingBottom: theme.spacing[6],
  });

  const formCardStyle = css({
    padding: theme.spacing[6],
    backgroundColor: theme.colors.surfaceNeutralSubtle,
    borderRadius: theme.borderRadius[2],
    border: `1px solid ${theme.colors.borderMain}`,
  });

  const resourceCardStyle = css({
    padding: theme.spacing[5],
    borderRadius: theme.borderRadius[2],
    border: `1px solid ${theme.colors.borderMain}`,
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.08)`,
    },
  });

  const statusBadgeSuccess = css({
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing[1],
    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
    backgroundColor: theme.colors.surfacePositive,
    borderRadius: theme.borderRadius[1],
    fontSize: "12px",
    fontWeight: "500",
  });

  const statusBadgeError = css({
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing[1],
    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
    backgroundColor: theme.colors.surfaceDestructive,
    borderRadius: theme.borderRadius[1],
    fontSize: "12px",
    fontWeight: "500",
  });

  return (
    <Flex
      direction="column"
      css={{
        height: "100%",
        width: "100%",
        backgroundColor: theme.colors.surfaceNeutral,
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div className={containerStyle()}>
        <div className={headerStyle()}>
          <Flex direction="column" gap="2">
            <Flex gap="2" css={{ alignItems: "center" }}>
              <PluginIcon size={24} />
              <Text as="h1" variant="titles">
                Resources
              </Text>
            </Flex>
            <Text color="subtle">
              Connect to external REST APIs and integrate data into your projects
            </Text>
          </Flex>
        </div>

        {/* Main Content */}
        {resources.length === 0 && !showForm && (
          <Flex
            direction="column"
            gap="6"
            css={{
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              textAlign: "center",
            }}
          >
            <div
              css={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: theme.colors.surfaceNeutralHover,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PluginIcon size={40} />
            </div>
            <Flex direction="column" gap="2">
              <Text variant="titles">No resources yet</Text>
              <Text color="subtle" css={{ maxWidth: "400px" }}>
                Get started by adding your first REST API resource. You can then use these resources to fetch and display data in your projects.
              </Text>
            </Flex>
            <Button onClick={() => setShowForm(true)}>
              Add Your First Resource
            </Button>
          </Flex>
        )}

        {/* Add Resource Form */}
        {showForm && (
          <div className={formCardStyle()}>
            <Flex direction="column" gap="5">
              <Flex css={{ justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="labelsSemibold">Add REST API Resource</Text>
              </Flex>

              <Flex direction="column" gap="4">
                <Flex direction="column" gap="2">
                  <Label htmlFor="resource-name">Resource Name</Label>
                  <InputField
                    id="resource-name"
                    placeholder="e.g., Vehicles API"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <Text variant="descriptions" color="subtle" css={{ fontSize: "12px" }}>
                    A friendly name to identify this resource
                  </Text>
                </Flex>

                <Flex direction="column" gap="2">
                  <Label htmlFor="resource-url">API URL</Label>
                  <InputField
                    id="resource-url"
                    placeholder="http://localhost:1337/api/vehicles"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                  <Text variant="descriptions" color="subtle" css={{ fontSize: "12px" }}>
                    For local development: http://localhost:1337/api/[resource]
                    <br />
                    From Docker: http://host.docker.internal:1337/api/[resource]
                  </Text>
                </Flex>
              </Flex>

              <Flex gap="3" css={{ justifyContent: "flex-end" }}>
                <Button
                  color="neutral"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: "", url: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddResource} disabled={isLoading}>
                  {isLoading ? "Testing..." : "Add & Test"}
                </Button>
              </Flex>
            </Flex>
          </div>
        )}

        {/* Resources List */}
        {resources.length > 0 && (
          <Flex direction="column" gap="5">
            <Flex css={{ justifyContent: "space-between", alignItems: "center" }}>
              <Flex direction="column" gap="1">
                <Text variant="labelsSemibold">
                  Configured Resources ({resources.length})
                </Text>
                <Text color="subtle" css={{ fontSize: "12px" }}>
                  {resources.filter((r) => !r.error).length} working • {resources.filter((r) => r.error).length} failed
                </Text>
              </Flex>
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  + Add Resource
                </Button>
              )}
            </Flex>

            {showForm && (
              <div className={formCardStyle()}>
                <Flex direction="column" gap="5">
                  <Text variant="labelsSemibold">Add REST API Resource</Text>

                  <Flex direction="column" gap="4">
                    <Flex direction="column" gap="2">
                      <Label htmlFor="resource-name-2">Resource Name</Label>
                      <InputField
                        id="resource-name-2"
                        placeholder="e.g., Vehicles API"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </Flex>

                    <Flex direction="column" gap="2">
                      <Label htmlFor="resource-url-2">API URL</Label>
                      <InputField
                        id="resource-url-2"
                        placeholder="http://localhost:1337/api/vehicles"
                        value={formData.url}
                        onChange={(e) =>
                          setFormData({ ...formData, url: e.target.value })
                        }
                      />
                    </Flex>
                  </Flex>

                  <Flex gap="3" css={{ justifyContent: "flex-end" }}>
                    <Button
                      color="neutral"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({ name: "", url: "" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddResource} disabled={isLoading}>
                      {isLoading ? "Testing..." : "Add & Test"}
                    </Button>
                  </Flex>
                </Flex>
              </div>
            )}

            <Flex direction="column" gap="3">
              {resources.map((resource) => (
                <div key={resource.id} className={resourceCardStyle()}>
                  <Flex direction="column" gap="3">
                    <Flex
                      css={{
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Flex direction="column" gap="2" css={{ flex: 1 }}>
                        <Flex gap="2" css={{ alignItems: "center" }}>
                          <Text variant="labelsSemibold">{resource.name}</Text>
                          {resource.error ? (
                            <div className={statusBadgeError()}>
                              <AlertIcon size={14} />
                              Failed
                            </div>
                          ) : (
                            <div className={statusBadgeSuccess()}>
                              <CheckMarkIcon size={14} />
                              Connected
                            </div>
                          )}
                        </Flex>
                        <Text
                          variant="descriptions"
                          css={{
                            wordBreak: "break-all",
                            fontSize: "12px",
                            fontFamily: "monospace",
                            backgroundColor: theme.colors.surfaceNeutralHover,
                            padding: theme.spacing[2],
                            borderRadius: theme.borderRadius[1],
                          }}
                        >
                          {resource.url}
                        </Text>
                      </Flex>
                      <Flex gap="2">
                        {/* Refresh Button */}
                        <Button
                          color="neutral"
                          onClick={() => handleRefreshResource(resource)}
                          title="Refresh Data"
                        >
                          ↻
                        </Button>
                        <Button
                          color="neutral"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <TrashIcon size={16} />
                        </Button>
                      </Flex>
                    </Flex>

                    {resource.error ? (
                      <Text
                        color="destructive"
                        css={{
                          fontSize: "12px",
                          padding: theme.spacing[2],
                          backgroundColor: theme.colors.surfaceDestructive,
                          borderRadius: theme.borderRadius[1],
                        }}
                      >
                        {resource.error}
                      </Text>
                    ) : (
                      resource.data && (
                        <pre
                          style={{
                            backgroundColor: theme.colors.surfaceNeutralHover,
                            padding: theme.spacing[3],
                            borderRadius: theme.borderRadius[1],
                            fontSize: "11px",
                            overflow: "auto",
                            maxHeight: "250px",
                            margin: 0,
                            border: `1px solid ${theme.colors.borderMain}`,
                          }}
                        >
                          {JSON.stringify(resource.data, null, 2)}
                        </pre>
                      )
                    )}
                  </Flex>
                </div>
              ))}
            </Flex>
          </Flex>
        )}
      </div>
    </Flex>
  );
};