window.onerror = function (message, source, lineno, colno, error) {
  console.error("Error occurred: ", message, " at ", source, ":", lineno, ":", colno);
  console.error("Stack trace: ", error.stack);
};

import React, { useState } from "react";
import { Container, Box, VStack, Text, Input, Button, Heading, HStack } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const initialColumns = {
  backlog: {
    name: "Backlog",
    items: [
      { id: "1", content: "As a user I want to create new account and delete my blog posts." },
      { id: "2", content: "As a User I want to create my personal account." },
    ],
  },
  designSprint: {
    name: "DESIGN SPRINT #7",
    items: [
      { id: "3", content: "Design for the landing page" },
      { id: "4", content: "Design for the My Account section" },
    ],
  },
  devSprint: {
    name: "DEV SPRINT #13",
    items: [
      { id: "5", content: "As a user I want to be able to create new posts from My Dashboard" },
      { id: "6", content: "As an administrator I want to be able to manage my users." },
    ],
  },
  accepted: {
    name: "Accepted",
    items: [
      { id: "7", content: "As a user I want to be able to send a message" },
      { id: "8", content: "As an administrator I want to be able to login, create new account, delete account or merge few accounts together." },
    ],
  },
};

const Q9 = () => {
  // Define the functionality of Q9 here
  console.log("Q9 function is called");
};

const Index = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [columnOrder, setColumnOrder] = useState(Object.keys(initialColumns));
  const [newTickets, setNewTickets] = useState({
    backlog: "",
    designSprint: "",
    devSprint: "",
    accepted: "",
  });
  const [editingTicket, setEditingTicket] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const onDragEnd = (result, columns, setColumns, columnOrder, setColumnOrder) => {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (type === "COLUMN") {
      const newColumnOrder = Array.from(columnOrder);
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);
      setColumnOrder(newColumnOrder);
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const addTicket = (columnId) => {
    if (newTickets[columnId].trim() === "") return;
    const newTicketItem = { id: Date.now().toString(), content: newTickets[columnId] };
    const column = columns[columnId];
    const updatedItems = [...column.items, newTicketItem];
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: updatedItems,
      },
    });
    setNewTickets({
      ...newTickets,
      [columnId]: "",
    });
  };

  const handleInputChange = (e, columnId) => {
    setNewTickets({
      ...newTickets,
      [columnId]: e.target.value,
    });
  };

  const handleTicketClick = (ticket) => {
    setEditingTicket(ticket);
    setEditingContent(ticket.content);
    console.log("Editing ticket:", ticket);
  };

  const handleSaveClick = () => {
    console.log("Save button clicked");
    if (editingTicket) {
      const updatedColumns = { ...columns };
      Object.keys(updatedColumns).forEach((columnId) => {
        const column = updatedColumns[columnId];
        const ticketIndex = column.items.findIndex((item) => item.id === editingTicket.id);
        if (ticketIndex !== -1) {
          column.items[ticketIndex].content = editingContent;
        }
      });
      setColumns(updatedColumns);
      setEditingTicket(null); // Set to null to make the card non-editable
      setEditingContent(""); // Clear the editing content
      console.log("Ticket saved:", updatedColumns);
    }
  };

  const handleCancelClick = () => {
    console.log("Cancel button clicked");
    setEditingTicket(null); // Set to null to make the card non-editable
    setEditingContent(""); // Clear the editing content
    console.log("Edit canceled");
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Heading mb={4}>Trello Clone</Heading>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns, columnOrder, setColumnOrder)}>
        <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <Box display="flex" {...provided.droppableProps} ref={provided.innerRef}>
              {columnOrder.map((columnId, index) => {
                const column = columns[columnId];
                return (
                  <Draggable draggableId={columnId} index={index} key={columnId}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        w="24%"
                        p={2}
                        bg="gray.100"
                        borderRadius="md"
                      >
                        <Heading size="md" mb={4}>{column.name}</Heading>
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => (
                            <VStack
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              bg={snapshot.isDraggingOver ? "blue.100" : "gray.100"}
                              p={4}
                              borderRadius="md"
                              minHeight="400px"
                            >
                              {column.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot) => (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      p={4}
                                      mb={4}
                                      bg="white"
                                      borderRadius="md"
                                      boxShadow="md"
                                      border={snapshot.isDragging ? "2px solid blue" : "none"}
                                      onClick={() => handleTicketClick(item)}
                                    >
                                      {editingTicket && editingTicket.id === item.id ? (
                                        <Box>
                                          <Input
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            mb={2}
                                          />
                                          <HStack>
                                            <Button colorScheme="blue" onClick={handleSaveClick}>Save</Button>
                                            <Button onClick={handleCancelClick}>Cancel</Button>
                                          </HStack>
                                        </Box>
                                      ) : (
                                        <Text>{item.content}</Text>
                                      )}
                                    </Box>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </VStack>
                          )}
                        </Droppable>
                        <Input
                          placeholder="Add new ticket..."
                          value={newTickets[columnId]}
                          onChange={(e) => handleInputChange(e, columnId)}
                          mt={4}
                        />
                        <Button onClick={() => addTicket(columnId)} mt={2} colorScheme="blue">
                          Add Ticket
                        </Button>
                      </Box>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default Index;