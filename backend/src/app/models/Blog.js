class Blog {
  constructor(
    title,
    date_created,
    date_updated,
    datte_approved,
    thumbnail,
    hashtags,
    description,
    content,
    views,
    sumary,
    duration,
    status_id,
    user_id
  ) {
    this.title = title;
    this.date_created = date_created;
    this.date_updated = date_updated;
    this.datte_approved = datte_approved;
    this.thumbnail = thumbnail;
    this.hashtags = hashtags;
    this.description = description;
    this.content = content;
    this.views = views;
    this.sumary = sumary;
    this.duration = duration;
    this.status_id = status_id;
    this.user_id = user_id;
  }
}
module.exports = Blog;
