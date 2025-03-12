import DateFormatter from "@/components/date-formatter";

type Props = {
  name: string;
  picture: string;
  date: string;
};

const Avatar = ({ name, picture, date }: Props) => {
  return (
    <div className="flex items-center">
      <img src={picture} className="w-10 h-10 rounded-full mr-4" alt={name} />
        <div className="flex flex-col">
            <div className="text-lg font-bold">{name}</div>
            <DateFormatter dateString={date}/>
        </div>
    </div>
  );
};

export default Avatar;
