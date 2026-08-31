import React, { useState } from 'react';
import { Course } from '../../types';
import { Badge, Button, ProgressBar, RatingStars } from './CommonUI';
import { ClockIcon, UsersIcon, PlayCircleIcon } from '../icons/Icons';

type CourseCardProps = {
  course: Course;
  onViewDetails?: (course: Course) => void;
  onBuyCourse?: (course: Course) => void;
  onContinueLearning?: (course: Course) => void;
  showProgress?: boolean;
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onViewDetails,
  onBuyCourse,
  onContinueLearning,
  showProgress = false,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(course.image);
  const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZUU2RjgiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvdXJzZSBJbWFnZTwvdGV4dD48L3N2Zz4=';

  return (
    <div className="course-card">
      <div className="course-thumbnail-wrap">
        <img
          src={imageSrc}
          alt={course.title}
          loading="lazy"
          onError={() => setImageSrc(placeholder)}
        />
        {course.badge && (
          <div className="course-badge-overlay">
            <Badge variant="primary">{course.badge}</Badge>
          </div>
        )}
        <div className="course-level-overlay">
          <Badge variant="neutral">{course.level}</Badge>
        </div>
      </div>

      <div className="course-card-body">
        <span className="course-card-category">{course.category}</span>
        <h4 className="course-card-title">{course.title}</h4>

        <div className="course-card-instructor">
          {course.instructorAvatar && (
            <img
              src={course.instructorAvatar}
              alt={course.instructor}
              className="instructor-avatar-xs"
            />
          )}
          <span>{course.instructor}</span>
        </div>

        <div className="course-meta-row">
          <RatingStars rating={course.rating} reviewsCount={course.reviewsCount} />
          <div className="course-meta-item">
            <ClockIcon size={14} />
            <span>{course.duration.split(' ')[0]} {course.duration.split(' ')[1]}</span>
          </div>
          <div className="course-meta-item">
            <UsersIcon size={14} />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        {showProgress && course.purchased && (
          <ProgressBar progress={course.progress || 0} showLabel={true} />
        )}

        <div className="course-card-footer">
          {course.purchased ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="success">Enrolled</Badge>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {course.progress || 0}% Done
              </span>
            </div>
          ) : (
            <div className="course-price-wrap">
              <span className="course-price-current">₹{course.price.toLocaleString('en-IN')}</span>
              {course.originalPrice && (
                <span className="course-price-original">₹{course.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            {course.purchased ? (
              <Button
                variant="primary"
                size="sm"
                icon={<PlayCircleIcon size={16} />}
                onClick={() => (onContinueLearning ? onContinueLearning(course) : onViewDetails?.(course))}
              >
                Learn
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewDetails?.(course)}
                >
                  Details
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onBuyCourse?.(course)}
                >
                  Buy Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
