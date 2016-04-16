USE [navs]
GO
/****** Object:  Schema [config]    Script Date: 3/23/2016 9:28:13 PM ******/
CREATE SCHEMA [config]
GO
/****** Object:  Schema [mykth]    Script Date: 3/23/2016 9:28:13 PM ******/
CREATE SCHEMA [mykth]
GO
/****** Object:  Table [mykth].[Classified]    Script Date: 3/23/2016 9:28:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [mykth].[Classified](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Dated] [datetime] NULL,
	[UserId] [int] NULL,
	[Heading] [nvarchar](100) NULL,
	[CategoryCode] [nvarchar](35) NULL,
	[Advert] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](15) NULL,
	[EmailAddress] [nvarchar](35) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [mykth].[ContactUs]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [mykth].[ContactUs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Dated] [datetime] NULL,
	[UserId] [int] NULL,
	[Comments] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [mykth].[Message]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [mykth].[Message](
	[MessageId] [int] IDENTITY(1,1) NOT NULL,
	[CreatedDate] [datetime] NULL DEFAULT (getdate()),
	[From] [nvarchar](35) NULL,
	[To] [nvarchar](35) NULL,
	[MessageBody] [nvarchar](max) NULL,
	[Delivered] [bit] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [mykth].[Product]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [mykth].[Product](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](35) NOT NULL,
	[description] [varchar](255) NOT NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [mykth].[Story]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [mykth].[Story](
	[StoryId] [int] IDENTITY(1,1) NOT NULL,
	[CreatedBy] [nvarchar](15) NULL,
	[CreatedDate] [datetime] NULL DEFAULT (getdate()),
	[Title] [nvarchar](50) NULL,
	[Content] [text] NULL,
	[ShowOnHomePage] [bit] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [mykth].[StoryComments]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [mykth].[StoryComments](
	[StoryCommentsId] [int] IDENTITY(1,1) NOT NULL,
	[StoryId] [int] NULL,
	[UserName] [nvarchar](15) NULL,
	[Comments] [nvarchar](max) NULL,
	[CreatedDateTime] [datetime] NULL DEFAULT (getdate()),
	[ParentStoryId] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [mykth].[StoryCommentsLike]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [mykth].[StoryCommentsLike](
	[StoryCommentsLikeId] [int] IDENTITY(1,1) NOT NULL,
	[StoryCommentsId] [int] NOT NULL,
	[UserName] [nvarchar](15) NOT NULL,
	[CreatedDateTime] [datetime] NULL DEFAULT (getdate())
) ON [PRIMARY]

GO
/****** Object:  Table [mykth].[User]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [mykth].[User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[CreatedDate] [datetime] NULL DEFAULT (getdate()),
	[LastModifiedDate] [datetime] NULL,
	[LastLoginDate] [datetime] NULL,
	[Comments] [nvarchar](100) NULL,
	[UserName] [nvarchar](35) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[Password] [nvarchar](15) NOT NULL,
	[PasswordSalt] [nvarchar](15) NULL,
	[LastLogin1p] [nvarchar](40) NULL,
	[IsActivated] [bit] NULL DEFAULT ((1)),
	[IsLockedOut] [bit] NULL DEFAULT ((0)),
	[LastLockedOutDate] [datetime] NULL,
	[LastLockedOutReason] [nvarchar](35) NULL,
	[NewPasswordKey] [nvarchar](128) NULL,
	[NewPasswordRequested] [datetime] NULL,
	[NewEmail] [nvarchar](35) NULL,
	[NewEmailKey] [nvarchar](128) NULL,
	[NewEmailRequested] [datetime] NULL,
	[FirstName] [nvarchar](35) NULL,
	[LastName] [nvarchar](35) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [mykth].[WebHit]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [mykth].[WebHit](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Dated] [datetime] NULL DEFAULT (getdate()),
	[url] [varchar](max) NULL,
	[ipAddress] [varchar](15) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [navs].[Location]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [navs].[Location](
	[LocationId] [int] IDENTITY(1,1) NOT NULL,
	[Region] [varchar](15) NULL,
	[City] [varchar](35) NULL,
	[Country] [varchar](35) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [navs].[person]    Script Date: 3/23/2016 9:28:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [navs].[person](
	[personId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](35) NULL,
	[SurName] [varchar](35) NULL,
	[LocationId] [int] NULL,
	[Age] [int] NULL,
	[Income] [numeric](30, 5) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
ALTER TABLE [mykth].[Classified] ADD  DEFAULT (getdate()) FOR [Dated]
GO
ALTER TABLE [mykth].[ContactUs] ADD  DEFAULT (getdate()) FOR [Dated]
GO
