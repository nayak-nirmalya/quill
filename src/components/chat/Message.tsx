import React from "react";

import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";

export function Message({
  message,
  isNextMessageSamePerson,
}: {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}) {
  return (
    <div
      className={cn("flex items-end", {
        "justify-end": message.isUserMessage,
      })}
    >
      Message
    </div>
  );
}
